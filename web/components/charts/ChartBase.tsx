import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer, AreaChart, XAxis, YAxis,
  CartesianGrid, ReferenceLine, Tooltip, Area,
} from 'recharts';
import { format, differenceInCalendarDays } from 'date-fns';
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
  yMin?: number;
  yMax?: number;
}

export default function ChartBase({ 
  metric, 
  title, 
  series, 
  children, 
  thresholds = [],
  yMin,
  yMax
}: ChartBaseProps) {
  const totalDays = series.length;
  const today = new Date();
  
  // Define time range options
  const ranges = [
    { label: '1 Y', days: 365 },
    { label: '2 Y', days: 730 },
    { label: 'Max', days: totalDays },
  ];
  
  // Default to showing maximum available data
  const [selectedRange, setSelectedRange] = useState(ranges[2]);
  
  // Filter data based on selected range
  const data = useMemo(
    () => series.slice(-Math.min(selectedRange.days, totalDays)),
    [selectedRange.days, totalDays, series]
  );
  
  // Fixed color for all charts
  const color = '#2962ff';

  return (
    <div id={`chart-${metric}`} className="mb-12">
      {/* Chart Title and Range Selector */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold">{title}</h3>
        <div className="flex space-x-2">
          {ranges.map((range) => (
            <button
              key={range.label}
              className={`px-2 py-1 text-xs rounded ${
                selectedRange.label === range.label
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              onClick={() => setSelectedRange(range)}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>
      
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
            minTickGap={30}
          />
          <YAxis
            tickFormatter={v => fmt$(v)}
            width={60}
            domain={[yMin || 'auto', yMax || 'auto']}
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