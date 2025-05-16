'use client';
import { useEffect, useState } from 'react';
import MetricWidget, { MetricType } from './MetricWidget';
import { getDashboardData, getSeriesData } from '../lib/data';

export default function MicroDashStrip() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [seriesData, setSeriesData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  const ORDER: [MetricType, string][] = [
    ['on_rrp', 'ON‑RRP'],
    ['reserves', 'Reserves'],
    ['move', 'MOVE'],
    ['srf', 'SRF'],
    ['tail', 'Funding'],
  ];

  useEffect(() => {
    async function loadData() {
      try {
        // Fetch dashboard data
        const dashboard = await getDashboardData();
        setDashboardData(dashboard);
        
        // Fetch series data for each metric
        const seriesPromises = ORDER.map(async ([key]) => {
          const metricKey = key === 'tail' ? 'funding' : key;
          const data = await getSeriesData(metricKey);
          return [metricKey, data] as [string, any];
        });
        
        const results = await Promise.all(seriesPromises);
        const seriesObj: Record<string, any> = {};
        results.forEach(([key, data]) => {
          seriesObj[key] = data;
        });
        
        setSeriesData(seriesObj);
      } catch (error) {
        console.error('Error loading data for MicroDashStrip:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-indigo-600 border-r-transparent"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 px-4 md:px-0">
      {ORDER.map(([key, label]) => {
        // select appropriate series
        const dataKey = key === 'tail' ? 'funding' : key;
        const status = dashboardData?.status?.[key] || 'green';
        
        return (
          <MetricWidget
            key={key}
            metric={key}
            title={label}
            data={seriesData[dataKey] || []}
            status={status}
          />
        );
      })}
    </div>
  );
} 