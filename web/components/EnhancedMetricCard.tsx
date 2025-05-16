import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface BulletChartProps {
  value: number;
  target: number;
  max: number;
  status: string;
}

const BulletChart = ({ value, target, max, status }: BulletChartProps) => {
  // Calculate percentages for positioning
  const valuePercent = Math.min((value / max) * 100, 100);
  const targetPercent = Math.min((target / max) * 100, 100);
  
  return (
    <div className="relative h-4 w-full bg-gray-200 rounded-sm mt-2">
      {/* Value bar */}
      <div 
        className={`absolute left-0 h-full bg-status-${status} rounded-sm transition-all duration-500`}
        style={{ width: `${valuePercent}%` }}
      />
      {/* Target marker */}
      {target > 0 && (
        <div 
          className="absolute w-0.5 h-6 bg-gray-800 -top-1"
          style={{ left: `${targetPercent}%` }}
        />
      )}
    </div>
  );
};

interface Props {
  title: string;
  value: number;
  formattedValue?: string;
  status: string;
  data: { value: number }[]; // sparkline data
  delta?: number | null;
  daysToZero?: number | null;
  floorValue?: number;
  maxValue?: number;
  showBullet?: boolean;
}

// Simple sparkline component
const SimpleSparkline = ({ data, status }: { data: { value: number }[], status: string }) => {
  if (data.length < 2) return null;
  
  // Find min and max for scaling
  const values = data.map(d => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1; // Avoid division by zero
  
  // Create points for a simple SVG polyline
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100; // Scale to 0-100%
    const y = 100 - ((d.value - min) / range) * 100; // Scale to 0-100% and invert
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke={`var(--status-${status})`}
        strokeWidth="2"
      />
    </svg>
  );
};

// Format number with appropriate K/M/B suffix
const formatNumber = (num: number): string => {
  if (num >= 1000000000) {
    return `${(num / 1000000000).toFixed(1)}B`;
  } else if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

export default function EnhancedMetricCard({ 
  title, 
  value, 
  formattedValue,
  status, 
  data,
  delta = null,
  daysToZero = null,
  floorValue = 0,
  maxValue,
  showBullet = false
}: Props) {
  // Format value if no formatted version provided
  const displayValue = formattedValue || formatNumber(value);
  
  // Determine max value for bullet chart if not provided
  const bulletMax = maxValue || (value * 1.5);
  
  return (
    <Card className="transition hover:shadow-lg">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xs text-slate-600 uppercase">{title}</h3>
          {delta !== null && (
            <div className={`text-xs font-medium ${delta >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {delta >= 0 ? '↑' : '↓'} {Math.abs(delta).toLocaleString()}
            </div>
          )}
        </div>
        
        <div className={`text-2xl font-semibold text-status-${status}`}>{displayValue}</div>
        
        {daysToZero !== null && (
          <div className="text-xs text-slate-500 mt-1">
            {daysToZero > 0 ? `${daysToZero} days at current pace` : 'Increasing'}
          </div>
        )}
        
        {showBullet && (
          <BulletChart 
            value={value} 
            target={floorValue} 
            max={bulletMax} 
            status={status} 
          />
        )}
        
        <div className="h-10 mt-2">
          {data.length > 1 && (
            <SimpleSparkline data={data} status={status} />
          )}
        </div>
      </CardContent>
    </Card>
  );
} 