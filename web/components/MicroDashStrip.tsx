'use client';
import MetricWidget from './MetricWidget';
import onRrpSeries from '../public/series/on_rrp.json';
import reservesSeries from '../public/series/reserves.json';
import moveSeries from '../public/series/move.json';
import srfSeries from '../public/series/srf.json';
import fundingSeries from '../public/series/funding.json';
import snap from '../public/dashboard.json';

export default function MicroDashStrip() {
  const ORDER: [keyof typeof snap.status, string][] = [
    ['on_rrp', 'ON‑RRP'],
    ['reserves', 'Reserves'],
    ['move', 'MOVE'],
    ['srf', 'SRF'],
    ['tail', 'Funding'],
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 px-4 md:px-0">
      {ORDER.map(([key, label]) => {
        // select appropriate series
        const dataMap: Record<string, any> = {
          on_rrp: onRrpSeries,
          reserves: reservesSeries,
          move: moveSeries,
          srf: srfSeries,
          tail: fundingSeries,
        };
        return (
          <MetricWidget
            key={key}
            metric={key}
            title={label}
            data={dataMap[key]}
          />
        );
      })}
    </div>
  );
} 