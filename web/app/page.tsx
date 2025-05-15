import React from 'react';
import MetricCard from "@/components/MetricCard";
// @ts-ignore
import data from "../public/dashboard.json";

// TypeScript interface for our data
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
  };
  [key: string]: any; // Index signature to allow string indexing
}

export default function Home() {
  return (
    <main className="max-w-6xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Liquidity Thermometer</h1>
      <div className="mt-8">
        <h2>What are these numbers?</h2>
        <p>Scroll down for plain‑English explanations …</p>
      </div>
    </main>
  );
} 