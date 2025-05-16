import React from 'react';
import MetricCard from "@/components/MetricCard";
// @ts-ignore - Import JSON directly
import snap from "../public/dashboard.json";
// @ts-ignore - Import sparks data
import sparks from "../public/sparks.json";

// Helper function to format the series data for charts
const series = (k: string) =>
  (sparks as any[]).map((r) => ({ value: r[k] }));

// Define the dashboard data interface
interface DashboardData {
  date: string;
  on_rrp: number;
  reserves: number;
  move: number;
  srf: number;
  bill_share: number;
  tail_bp: number;
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

// Cast the imported data to our interface
const data: DashboardData = snap as DashboardData;

export default function Home() {
  const metrics = [
    { key: "on_rrp", label: "ON‑RRP ($m)" },
    { key: "reserves", label: "Reserves ($m)" },
    { key: "move", label: "MOVE" },
    { key: "srf", label: "SRF usage ($m)" },
    { key: "tail", label: "Bills & Tails" },
  ];

  return (
    <main className="max-w-6xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Liquidity Thermometer</h1>
      <p className="text-sm text-blue-500 mb-4">Last updated: {data.date}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((m) => (
          <MetricCard
            key={m.key}
            title={m.label}
            value={data[m.key]}
            status={data.status[m.key]}
            data={series(m.key)}
          />
        ))}
      </div>
      <section className="mt-8 prose max-w-none">
        <h2>What are these numbers?</h2>
        <p>Scroll down for plain‑English explanations …</p>
      </section>
    </main>
  );
} 