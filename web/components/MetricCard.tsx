"use client";

import React from 'react';
import { Card, CardContent } from "../components/ui/card";
import Light from "./TrafficLight";
import Spark from "./Spark";
import Bullet from "./BulletBar";
import { fmt } from "../lib/format";

interface Props {
  title: string;
  value: string | number;
  status: "green" | "amber" | "red";
  type: "spark" | "bullet";
  data?: { value: number }[]; // sparkline data
  subtitle?: string;
  metricKey?: string;
}

export default function CardMetric(p: Props) {
  return (
    <Card className="bg-card-bg ring-1 ring-card-ring rounded-xl shadow-md hover:shadow-lg transition">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-[11px] font-semibold text-slate-500 uppercase">{p.title}</h3>
          <Light status={p.status}/>
        </div>
        <div title={typeof p.value==='number'?p.value.toLocaleString('en-US',{style:'currency',currency:'USD'}):''} className={`text-2xl font-bold text-status-${p.status}`}>{typeof p.value==='number'?fmt(p.value):p.value}</div>
        {p.subtitle&&<p className="text-[10px] text-slate-500 mb-1">{p.subtitle}</p>}
        <div className="h-6">
          {p.type==='spark'&&p.data&&<Spark data={p.data}/>} 
          {p.type==='bullet'&&typeof p.value==='number'&&<Bullet value={p.value} floor={2_500_000_000_000}/>} 
        </div>
      </CardContent>
    </Card>
  );
} 