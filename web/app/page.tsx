'use client';
import React from 'react';
import Image from 'next/image';
import OnRrpChart from '@/components/charts/OnRrpChart';
import ReservesChart from '@/components/charts/ReservesChart';
import MoveChart from '@/components/charts/MoveChart';
import SrfChart from '@/components/charts/SrfChart';
import FundingChart from '@/components/charts/FundingChart';
import MicroDashStrip from '@/components/MicroDashStrip';

export default function Home() {
  // Mock metadata for each chart
  const meta = { date: '2024-05-16' };

  return (
    <>
      <header className="bg-white py-16">
        <div className="container mx-auto flex flex-col md:flex-row items-start gap-12 px-4 md:px-0">
          <div className="w-full md:w-2/3 space-y-8">
            <h1 className="text-6xl md:text-7xl font-extrabold leading-tight text-text">
              When does the Fed have to pivot?<br/>
              <span className="text-indigo-600">Watch the plumbing...</span>
            </h1>
            <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
              <MicroDashStrip />
            </div>
            <div className="max-w-3xl">
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                These five plumbing dials reveal how healthy U.S. dollar liquidity really is: where cash is parked,
                whether banks have enough reserves, how jittery bond traders are, if dealers need to tap the Fed's
                lending window, and whether investors are lining up to buy—or demanding a premium for—government debt.
                Together, they paint a real-time picture of system pressure: <strong>whenever three or more of these
                indicators have entered the red zone, the Fed has stepped in</strong> in every major crisis since
                September 2019.
              </p>
            </div>
          </div>
          <div className="hidden lg:flex w-full lg:w-1/4 justify-end">
            <div className="max-h-80 object-contain rounded-lg shadow-lg bg-gray-100 w-full h-80"></div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-0 space-y-12 mb-16">
        {/* Charts section */}
        <div className="space-y-12">
          <OnRrpChart meta={meta} />
          <ReservesChart meta={meta} />
          <MoveChart meta={meta} />
          <SrfChart meta={meta} />
          <FundingChart meta={meta} />
        </div>
      
        <div className="mt-8">
          <details className="md:open">
            <summary className="text-xl font-semibold cursor-pointer mb-4 md:mb-0">What are these metrics?</summary>
            <div className="pl-4 pr-2 pt-4">
              <p className="text-sm text-gray-700 mb-4">
                These indicators track Fed-linked USD liquidity conditions that have historically preceded policy pivots.
                Threshold crossings in multiple metrics often signal heightened risk and potential market reactions.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <h3 className="text-lg font-medium">ON-RRP & Reserves</h3>
                  <p className="text-sm text-gray-600">
                    The Overnight Reverse Repo Facility and bank reserve balances track the most liquid components 
                    of the Fed's balance sheet. Sharp declines can indicate tightening market conditions.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">MOVE Index</h3>
                  <p className="text-sm text-gray-600">
                    The MOVE index measures implied volatility in Treasury markets. Elevated readings 
                    suggest stress and uncertainty in the most liquid financial market.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Standing Repo Facility (SRF)</h3>
                  <p className="text-sm text-gray-600">
                    The Standing Repo Facility provides liquidity against Treasury collateral. 
                    Usage indicates potential funding stress in Treasury markets.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Treasury Funding</h3>
                  <p className="text-sm text-gray-600">
                    Bill share shows short-term vs. long-term debt issuance. Tail performance measures 
                    auction demand. Both signal potential Treasury market strain.
                  </p>
                </div>
              </div>
            </div>
          </details>
        </div>
      </main>
    </>
  );
} 