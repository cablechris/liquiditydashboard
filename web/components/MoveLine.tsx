"use client";
import { ResponsiveContainer, LineChart, Line, ReferenceArea, ReferenceLine, Tooltip } from 'recharts';

interface MoveLineProps {
  data: any[];
}

const recess = [["2020-02-01", "2020-05-01"]];
const fomc = ['2023-12-13', '2024-03-20', '2024-06-12', '2024-09-18'];

export default function MoveLine({ data }: MoveLineProps) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data}>
        {recess.map(([s, e]) => (
          <ReferenceArea key={s} x1={s} x2={e} y1={0} y2={400} fill="#f3f4f6" />
        ))}
        {fomc.map(d => (
          <ReferenceLine key={d} x={d} strokeDasharray="3 3" stroke="#94a3b8" />
        ))}
        <ReferenceArea y1={140} y2={400} fill="#fee2e2" />
        <Line 
          type="monotone" 
          dataKey="move" 
          stroke="#4b5563" 
          strokeWidth={1.5} 
          dot={false} 
        />
        <Tooltip 
          contentStyle={{background:'#fff', border:'1px solid #e2e8f0', fontSize: 12}} 
          formatter={(v) => v.toLocaleString()} 
          labelFormatter={(label) => `Date: ${label}`}
        />
      </LineChart>
    </ResponsiveContainer>
  );
} 