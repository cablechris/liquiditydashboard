import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
// Simple custom sparkline implementation instead of Recharts
// to avoid the "Super expression must either be null or a function" error

interface Props {
  title: string;
  value: string | number;
  status: string;
  data: { value: number }[]; // sparkline data
}

// Simple sparkline component that doesn't use class inheritance
const SimpleSparkline = ({ data }: { data: { value: number }[] }) => {
  if (data.length < 2) return null;
  
  // Find min and max for scaling
  const values = data.map(d => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1; // Avoid division by zero
  
  // Create points for a simple SVG polyline
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100; // Scale to 0-100%
    const y = 100 - ((d.value - min) / range) * 100; // Scale to 0-100% and invert (0 is top in SVG)
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke="#94a3b8"
        strokeWidth="2"
      />
    </svg>
  );
};

export default function MetricCard({ title, value, status, data }: Props) {
  return (
    <Card className="transition hover:shadow-lg">
      <CardContent className="p-3">
        <h3 className="text-xs text-slate-600 uppercase mb-1">{title}</h3>
        <div className={`text-2xl font-semibold text-status-${status}`}>{value}</div>
        <div className="h-6">
          {data.length > 1 && (
            <SimpleSparkline data={data} />
          )}
        </div>
      </CardContent>
    </Card>
  );
} 