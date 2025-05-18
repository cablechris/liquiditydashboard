import { NextApiRequest, NextApiResponse } from 'next';
import kv, { KV_KEYS } from '../../lib/kv';
import { fetcher } from '../../lib/fetcher';

// Vercel Cron syntax: 
// Optional: Setup cron in your vercel.json to run this endpoint automatically
// "crons": [{ "path": "/api/update-data", "schedule": "0 0 * * *" }]

// API key must be set as an environment variable in production

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Security check - only allow authorized requests
  // If using custom auth, can add check here
  if (process.env.UPDATE_SECRET && req.headers.authorization !== `Bearer ${process.env.UPDATE_SECRET}`) {
    if (req.query.secret !== process.env.UPDATE_SECRET) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  }

  try {
    // Fetch data from FRED API
    const dashboardData = await fetchDashboardData();
    
    // Store in KV
    await kv.set(KV_KEYS.DASHBOARD, dashboardData);
    
    // Also store the series data
    await updateSeriesData(dashboardData);
    
    // Update last updated timestamp
    await kv.set(KV_KEYS.LAST_UPDATED, new Date().toISOString());
    
    return res.status(200).json({ 
      success: true, 
      message: 'Data updated successfully',
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating data:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error updating data',
      error: error instanceof Error ? error.message : String(error)
    });
  }
}

async function fetchDashboardData() {
  // Fetch ON-RRP data
  const onRrpUrl = createFredUrl('RRPONTSYD');
  const onRrpData = await fetcher(onRrpUrl);
  const onRrp = parseLatestObservation(onRrpData);
  
  // Fetch Reserves data
  const reservesUrl = createFredUrl('WRBWFRBL');
  const reservesData = await fetcher(reservesUrl);
  const reserves = parseLatestObservation(reservesData);
  
  // Calculate statuses
  const status = {
    on_rrp: onRrp < 50_000 ? "red" : onRrp < 100_000 ? "amber" : "green",
    reserves: reserves < 2_500_000 ? "red" : reserves < 3_000_000 ? "amber" : "green",
    move: 120, // Default value (will be updated if fetched)
    srf: "green", // Default value
    tail: "green" // Default value
  };
  
  // Create dashboard object
  return {
    date: new Date().toISOString().split('T')[0],
    on_rrp: onRrp,
    reserves: reserves,
    move: 120, // Default value (will be updated if we add more data sources)
    srf: 0, // Default value
    bill_share: 0.5, // Default value
    tail_bp: 2, // Default value
    status
  };
}

interface DataPoint {
  date: string;
  value: number;
}

async function updateSeriesData(latestData: any) {
  // Get existing series data or initialize new
  const onRrpSeries = (await kv.get(KV_KEYS.SERIES.ON_RRP) || []) as DataPoint[];
  const reservesSeries = (await kv.get(KV_KEYS.SERIES.RESERVES) || []) as DataPoint[];
  
  // Add new data points with current date
  const today = new Date().toISOString().split('T')[0];
  const newPoint = { date: today };
  
  // Update ON-RRP series
  const updatedOnRrp = [...onRrpSeries, { 
    ...newPoint, 
    value: latestData.on_rrp 
  }];
  await kv.set(KV_KEYS.SERIES.ON_RRP, updatedOnRrp.slice(-365)); // Keep last year only
  
  // Update Reserves series
  const updatedReserves = [...reservesSeries, { 
    ...newPoint, 
    value: latestData.reserves 
  }];
  await kv.set(KV_KEYS.SERIES.RESERVES, updatedReserves.slice(-365)); // Keep last year only
  
  // Create sparks data (last 30 points)
  const sparks = updatedOnRrp.slice(-30).map((item, i) => ({
    date: item.date,
    on_rrp: item.value,
    reserves: updatedReserves[updatedReserves.length - 30 + i]?.value || 0
  }));
  
  await kv.set(KV_KEYS.SPARKS, sparks);
}

function createFredUrl(seriesId: string): string {
  // Only use environment variable - no fallback in production
  const apiKey = process.env.FRED_API_KEY;
  if (!apiKey) {
    throw new Error('FRED_API_KEY environment variable is not set');
  }
  
  return `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${apiKey}&file_type=json&sort_order=desc&limit=1`;
}

function parseLatestObservation(data: any): number {
  if (!data?.observations || !data.observations[0]) {
    throw new Error('Invalid FRED API response: missing observations');
  }
  
  const value = parseFloat(data.observations[0].value);
  if (isNaN(value)) {
    throw new Error('Invalid FRED API response: value is not a number');
  }
  
  return value;
} 