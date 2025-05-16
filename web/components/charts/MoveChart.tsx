'use client';
import React from 'react';
import ChartBase from './ChartBase';
import series from '@/public/series/move.json';

export default function MoveChart({ meta }: { meta: any }) {
  return (
    <ChartBase 
      metric="move" 
      title="MOVE Index - Treasury Volatility"
      series={series}
      thresholds={[
        { value: 140, color: '#dc2626', label: 'Red ≥ 140', position: 'insideTopRight' },
        { value: 120, color: '#eab308', label: 'Amber ≥ 120', position: 'insideTopRight' }
      ]}
    >
      <div className="mt-4 text-sm text-gray-600">
        <p className="mb-2">The MOVE index measures implied volatility in Treasury markets, functioning as the bond market's equivalent to the VIX. Elevated readings often precede significant market stress as they reflect uncertainty around future interest rates and monetary policy. When the MOVE index spikes above 120, it frequently signals heightened risk aversion among institutional investors and potential dislocations in funding markets.</p>
        <p className="mt-3 font-medium italic border-l-4 border-indigo-600 pl-3">"The MOVE Index is the smoke alarm for systemic risk. When Treasury volatility spikes, it tells you the bedrock of our financial system is trembling. And when the most liquid market in the world becomes unstable, everything built upon it will start to crack." — Jeffrey Gundlach, CEO of DoubleLine Capital</p>
      </div>
    </ChartBase>
  );
} 