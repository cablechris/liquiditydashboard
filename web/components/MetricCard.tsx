import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line } from "recharts";

interface Props {
  title: string;
  value: string | number;
  status: string; // Changed from "green" | "amber" | "red" to accept any string
  data: { value: number }[]; // sparkline data
}

export default function MetricCard({ title, value, status, data }: Props) {
  return (
    <Card className="transition hover:shadow-lg">
      <CardContent className="p-3">
        <h3 className="text-xs text-slate-600 uppercase mb-1">{title}</h3>
        <div className={`text-2xl font-semibold text-status-${status}`}>{value}</div>
        <div className="h-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <Line type="monotone" dataKey="value" stroke="#94a3b8" strokeWidth={1} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
} 