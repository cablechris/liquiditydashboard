'use client';
import React from 'react';
import ChartBase from './ChartBase';
import series from '@/public/series/on_rrp.json';

export default function OnRrpChart({ meta }: { meta: any }) {
  return (
    <ChartBase 
      metric="on_rrp" 
      title="Overnight Reverse Repo Facility (ON-RRP)"
      series={series}
      thresholds={[
        { value: 50000000000, color: '#dc2626', label: 'Red < $50B', position: 'insideTopRight' },
        { value: 100000000000, color: '#eab308', label: 'Amber < $100B', position: 'insideTopRight' }
      ]}
    >
      <div className="mt-4 text-sm text-gray-600">
        <p className="mb-2">The Overnight Reverse Repo Facility (ON-RRP) is a monetary policy tool used by the Federal Reserve to manage short-term interest rates by temporarily removing excess liquidity from the financial system. As a critical plumbing component, it represents the amount of cash that money market funds and other eligible counterparties park overnight at the Fed. Sharp declines suggest market participants are deploying cash elsewhere—either seeking higher yields in riskier assets or responding to liquidity stress in the broader financial system.</p>
        <p className="mt-3 font-medium italic border-l-4 border-indigo-600 pl-3">"The ON-RRP facility is essentially the relief valve of the financial system. When it's draining quickly, you need to pay attention. Think of it as the tide going out—when the facility drops below critical levels, you discover who's been swimming naked in terms of liquidity risk." — Zoltan Pozsar, Credit Suisse Global Head of Short-Term Interest Rate Strategy</p>
      </div>
    </ChartBase>
  );
} 