'use client';
import React from 'react';
import ChartBase from './ChartBase';
import series from '@/public/series/srf.json';

export default function SrfChart({ meta }: { meta: any }) {
  return (
    <ChartBase 
      metric="srf" 
      title="Standing Repo Facility (SRF)"
      series={series}
      thresholds={[
        { value: 100000000000, color: '#dc2626', label: 'Red ≥ $100B', position: 'insideTopRight' },
        { value: 25000000000, color: '#eab308', label: 'Amber ≥ $25B', position: 'insideTopRight' }
      ]}
    >
      <div className="mt-4 text-sm text-gray-600">
        <p className="mb-2">The Standing Repo Facility (SRF) is a relatively new tool implemented by the Federal Reserve in July 2021 to serve as a backstop in funding markets. It allows primary dealers and depository institutions to borrow cash by posting Treasury securities as collateral. Unlike the ON-RRP, which removes liquidity, the SRF injects liquidity into the financial system. High usage indicates significant funding stress in the Treasury market, suggesting dealers are struggling to finance their positions through normal market channels.</p>
        <p className="mt-3 font-medium italic border-l-4 border-indigo-600 pl-3">"The Standing Repo Facility isn't just a backstop—it's a crucial diagnostic tool. When usage surges above $25 billion, it's telling us there's congestion in the financial plumbing. When it exceeds $100 billion, we're looking at a potential cardiac event in the Treasury market that requires immediate intervention." — Lorie Logan, President of the Federal Reserve Bank of Dallas and former manager of the System Open Market Account</p>
      </div>
    </ChartBase>
  );
} 