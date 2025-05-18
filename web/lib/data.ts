import kv, { KV_KEYS } from './kv';
import { fetcher } from './fetcher';

// Type definition for dashboard data
interface DashboardData {
  date: string;
  lastUpdated?: string;
  status?: {
    on_rrp: string;
    reserves: string;
    move: string;
    srf: string;
    tail: string;
  };
  [key: string]: any;
}

/**
 * Fetches dashboard data, using the KV store if available,
 * falling back to static files if needed
 */
export async function getDashboardData(): Promise<DashboardData> {
  try {
    // Try to get data from KV store first
    const kvData = await kv.get(KV_KEYS.DASHBOARD);
    if (kvData) {
      return kvData as DashboardData;
    }
  } catch (error) {
    console.warn('Error fetching from KV store:', error);
    // Continue to fallback
  }

  // Fallback: fetch from static file
  return fetcher('/dashboard.json');
}

/**
 * Gets series data for a specific metric
 */
export async function getSeriesData(metric: string) {
  const kvKey = getSeriesKey(metric);
  
  try {
    // Try to get from KV store first
    if (kvKey) {
      const kvData = await kv.get(kvKey);
      if (kvData) {
        return kvData;
      }
    }
  } catch (error) {
    console.warn(`Error fetching ${metric} series from KV store:`, error);
    // Continue to fallback
  }

  // Fallback: fetch from static file
  return fetcher(`/series/${metric}.json`);
}

/**
 * Gets sparkline data for the dashboard strip
 */
export async function getSparksData() {
  try {
    // Try to get from KV store first
    const kvData = await kv.get(KV_KEYS.SPARKS);
    if (kvData) {
      return kvData;
    }
  } catch (error) {
    console.warn('Error fetching sparks data from KV store:', error);
    // Continue to fallback
  }

  // Fallback: fetch from static file
  return fetcher('/sparks.json');
}

/**
 * Gets the last time the data was updated
 */
export async function getLastUpdated() {
  try {
    // First try to get from dashboard data which may have the latest timestamp
    const dashboardData = await getDashboardData();
    if (dashboardData && dashboardData.lastUpdated) {
      return dashboardData.lastUpdated;
    }
    
    // Fall back to KV store
    const lastUpdated = await kv.get(KV_KEYS.LAST_UPDATED);
    return lastUpdated;
  } catch (error) {
    console.warn('Error fetching last updated time:', error);
    return null;
  }
}

/**
 * Helper to map metric names to KV keys
 */
function getSeriesKey(metric: string) {
  switch (metric) {
    case 'on_rrp':
      return KV_KEYS.SERIES.ON_RRP;
    case 'reserves':
      return KV_KEYS.SERIES.RESERVES;
    case 'move':
      return KV_KEYS.SERIES.MOVE;
    case 'srf':
      return KV_KEYS.SERIES.SRF;
    case 'funding':
      return KV_KEYS.SERIES.FUNDING;
    case 'bill_share':
      return KV_KEYS.SERIES.BILL_SHARE;
    case 'tail_bp':
      return KV_KEYS.SERIES.TAIL_BP;
    default:
      return null;
  }
} 