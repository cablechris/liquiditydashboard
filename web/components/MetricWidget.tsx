'use client';
import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  Tooltip,
  ReferenceDot,
  CartesianGrid,
  TooltipProps
} from 'recharts';
import { fmt$ } from '@/lib/format';
import snap from '@/public/dashboard.json';

// map status name to color hex
const STATUS_COLOR: Record<string,string> = {
  green: '#2962ff',
  amber: '#f57c00',
  red:   '#d32f2f',
};

interface Point { date: string; value: number; }
interface Props { metric: keyof typeof snap.status; title: string; data: Point[]; }

export default function MetricWidget({ metric, title, data }: Props) {
  const status = snap.status[metric];
  const color = STATUS_COLOR[status] || STATUS_COLOR.green;
  const sparkData = useMemo(() => data.slice(-90), [data]);
  const latest = sparkData[sparkData.length - 1];
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  return (
    <div className="bg-white border border-line rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-1 transition-transform duration-200">
      <div className="flex items-center mb-3">
        <div
          className="w-3 h-3 rounded-full border-2 mr-2"
          style={{ background: color, borderColor: '#fff', boxShadow: `0 0 6px ${color}33` }}
        />
        <h4 className="text-base font-semibold text-text uppercase tracking-wide">{title}</h4>
      </div>
      <div className="h-16 mb-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={sparkData}
            onMouseMove={(s) => setHoverIdx(s.activeTooltipIndex ?? null)}
            onMouseLeave={() => setHoverIdx(null)}
          >
            <defs>
              <linearGradient id={`grad-${metric}`} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.3}/>
                <stop offset="100%" stopColor={color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#e0e0e0" strokeDasharray="3 3" vertical={false}/>
            <Line
              dataKey="value"
              type="monotone"
              stroke={color}
              strokeWidth={hoverIdx !== null ? 3 : 2}
              fill={`url(#grad-${metric})`}
              dot={false}
            />
            {hoverIdx !== null && (
              <ReferenceDot
                x={sparkData[hoverIdx].date}
                y={sparkData[hoverIdx].value}
                r={4}
                fill={color}
                stroke="#fff"
                strokeWidth={2}
              />
            )}
            <Tooltip
              cursor={false}
              contentStyle={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)', padding: '8px' }}
              formatter={(v) => metric === 'move' ? String(v) : fmt$(v as number)}
              labelFormatter={(label) => {
                if (hoverIdx !== null && sparkData[hoverIdx]) {
                  const date = sparkData[hoverIdx].date;
                  return new Date(date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  });
                }
                return '';
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="text-lg font-bold text-text">
        {metric === 'move' ? String(latest.value) : fmt$(latest.value)}
      </div>
      <div className="text-xs text-gray-500 mt-1">{latest.date}</div>
    </div>
  );
} 