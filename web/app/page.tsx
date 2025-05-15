import React from 'react';
import MetricCard from "@/components/MetricCard";
// @ts-ignore
import data from "../public/dashboard.json";

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((m) => (
          <MetricCard
            key={m.key}
            title={m.label}
            value={data[m.key]}
            status={data.status[m.key]}
            data={[]} // TODO: load sparkline history
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