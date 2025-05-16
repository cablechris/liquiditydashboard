import React from 'react';
import {
  ResponsiveContainer, AreaChart, XAxis, YAxis,
  CartesianGrid, ReferenceLine, Tooltip, Area,
} from 'recharts';
import { format } from 'date-fns';
import { fmt$ } from '../../lib/format';

type LabelPosition = 
  | 'top' 
  | 'left' 
  | 'right' 
  | 'bottom' 
  | 'insideTop' 
  | 'insideLeft' 
  | 'insideRight' 
  | 'insideBottom' 
  | 'insideTopLeft' 
  | 'insideTopRight' 
  | 'insideBottomLeft' 
  | 'insideBottomRight';

interface ChartBaseProps {
  metric: string;
  title: string;
  series: any[];
  children?: React.ReactNode;
  thresholds?: {
    value: number;
    color: string;
    label: string;
    position?: LabelPosition;
  }[];
}

export default function ChartBase({ metric, title, series, children, thresholds = [] }: ChartBaseProps) {
  // Use the last 365 days of data by default
  const data = series.slice(-365);
  
  // Fixed color for all charts
  const color = '#2962ff';

  return (
    <div id={`chart-${metric}`} className="mb-12">
      {/* Chart Title */}
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      
      {/* Chart */}
      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id={`grad_${metric}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          
          {/* grid */}
          <CartesianGrid stroke="#e0e0e0" strokeDasharray="3 3" vertical={false} />
          
          {/* thresholds */}
          {thresholds.map((threshold, index) => (
            <ReferenceLine
              key={`threshold-${index}`}
              y={threshold.value}
              stroke={threshold.color}
              strokeDasharray="3 3"
              label={{ 
                value: threshold.label, 
                position: threshold.position || 'insideTopRight', 
                fill: threshold.color, 
                fontSize: 10 
              }}
            />
          ))}
          
          {/* series */}
          <Area
            dataKey="value"
            strokeOpacity={0.9}
            fillOpacity={1}
            fill={`url(#grad_${metric})`}
            stroke={color}
            dot={false}
          />
          
          {/* axes */}
          <XAxis
            dataKey="date"
            tickFormatter={(date) => format(new Date(date), 'MMM yy')}
            height={40}
          />
          <YAxis
            tickFormatter={v => fmt$(v)}
            width={60}
          />
          
          {/* tooltip */}
          <Tooltip
            formatter={v => fmt$(v as number)}
            labelFormatter={l => format(new Date(l as string), 'MMM d, yyyy')}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Figcaption slot */}
      {children}
    </div>
  );
} 