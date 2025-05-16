"use client";

import { ResponsiveContainer, LineChart, Line, Tooltip } from "recharts";

interface SparkProps {
  data: { value: number }[];
}

export default function Spark({ data }: SparkProps) {
  if (data.length < 2) return null;
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke="#94a3b8" 
          strokeWidth={1.5} 
          dot={false} 
          isAnimationActive={false}
        />
        <Tooltip 
          contentStyle={{background:'#fff',border:'1px solid #e2e8f0',fontSize:10}}
          formatter={(v) => v.toLocaleString()} 
          labelFormatter={() => ''}
        />
      </LineChart>
    </ResponsiveContainer>
  );
} 