'use client';
import snap from '../public/dashboard.json';
import { fmt$ } from '../lib/format';

// Define interface for the dashboard data with proper index signatures
interface DashboardData {
  date: string;
  on_rrp: number;
  reserves: number;
  move: number;
  srf: number;
  bill_share: number;
  tail_bp: number;
  on_rrp_delta30?: number;
  reserves_wow?: number;
  srf_ma7?: number;
  status: {
    on_rrp: string;
    reserves: string;
    move: string;
    srf: string;
    tail: string;
    [key: string]: string;
  };
  [key: string]: any;
}

// Cast snap to our typed interface
const typedData = snap as DashboardData;

const ORDER: [string, string][] = [
  ['on_rrp', 'ON-RRP'],
  ['reserves', 'Reserves'],
  ['move', 'MOVE'],
  ['srf', 'SRF'],
  ['tail', 'Funding'],
];

export default function Strip() {
  return (
    <div className="flex gap-6 justify-center mb-8">
      {ORDER.map(([k, label]) => {
        const status = typedData.status[k];
        const value = k === 'tail' ? 
          `${(typedData.bill_share * 100).toFixed(0)}% / ${typedData.tail_bp}bp` : 
          typedData[k];
        
        // Get the appropriate delta value based on key
        const getDelta = (key: string) => {
          if (key === 'on_rrp') return typedData.on_rrp_delta30;
          if (key === 'reserves') return typedData.reserves_wow;
          return null;
        };
        
        return (
          <div key={k} className="text-center group">
            <span
              className={`
                inline-block w-5 h-5 rounded-full
                bg-status-${status}
                shadow-md
                ${['amber','red'].includes(status) ? 'animate-pulseFade' : ''}
              `}
              style={{ cursor: 'pointer' }}
              title={`${label}: ${fmt$(value)} ${getDelta(k) ? `(Δ30d ${getDelta(k)})` : ''}`}
              onClick={() => {
                document
                  .getElementById(`chart-${k}`)
                  ?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
            <p className="text-[10px] mt-1 uppercase tracking-wide text-slate-500 group-hover:text-gray-900">
              {label}
            </p>
          </div>
        );
      })}
    </div>
  );
} 