'use client';
import React from 'react';
import ChartBase from './ChartBase';
import series from '@/public/series/reserves.json';

export default function ReservesChart({ meta }: { meta: any }) {
  return (
    <ChartBase 
      metric="reserves" 
      title="Bank Reserve Balances"
      series={series}
      thresholds={[
        { value: 2500000000000, color: '#dc2626', label: 'Red < $2.5T', position: 'insideTopRight' },
        { value: 3000000000000, color: '#eab308', label: 'Amber < $3T', position: 'insideTopRight' }
      ]}
    >
      <div className="mt-4 text-sm text-gray-600">
        <p className="mb-2">Bank reserves are deposits that commercial banks hold at the Federal Reserve to meet regulatory requirements and facilitate daily settlement operations. These reserves represent a critical buffer in the financial system, ensuring banks can meet withdrawal demands and maintain payment system functionality. When reserve balances decline significantly, it indicates tightening liquidity conditions that can stress interbank lending markets, reduce credit availability to the broader economy, and potentially trigger funding pressure across financial institutions.</p>
        <p className="mt-3 font-medium italic border-l-4 border-indigo-600 pl-3">"Think of bank reserves as the water level in the financial system. When reserves drop below the $3 trillion mark, you start to see rocks emerging. Below $2.5 trillion, suddenly you're navigating dangerous rapids, and the Fed will almost certainly be forced to intervene to avoid a systemic accident." — William Dudley, Former President of the Federal Reserve Bank of New York</p>
      </div>
    </ChartBase>
  );
} 