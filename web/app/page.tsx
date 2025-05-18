'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import OnRrpChart from '../components/charts/OnRrpChart';
import ReservesChart from '../components/charts/ReservesChart';
import MoveChart from '../components/charts/MoveChart';
import SrfChart from '../components/charts/SrfChart';
import FundingChart from '../components/charts/FundingChart';
import MicroDashStrip from '../components/MicroDashStrip';
import { getDashboardData, getLastUpdated } from '../lib/data';

export default function Home() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function loadData() {
    try {
      setRefreshing(true);
      const data = await getDashboardData();
      const updated = await getLastUpdated();
      setDashboardData(data);
      setLastUpdated(updated);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = () => {
    loadData();
  };

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
              <div className="flex justify-between items-center mb-2">
                <button 
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 transition-colors disabled:bg-indigo-300 disabled:cursor-not-allowed"
                >
                  {refreshing ? 'Refreshing...' : 'Refresh Data'}
                </button>
                {lastUpdated && (
                  <div className="text-xs text-gray-500">
                    Last updated: {new Date(lastUpdated).toLocaleString()}
                  </div>
                )}
              </div>
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
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
            <p className="mt-2 text-gray-600">Loading dashboard data...</p>
          </div>
        ) : (
          <>
            {/* Charts section */}
            <div className="space-y-12">
              <OnRrpChart meta={dashboardData || { date: new Date().toISOString().split('T')[0] }} />
              <ReservesChart meta={dashboardData || { date: new Date().toISOString().split('T')[0] }} />
              <MoveChart meta={dashboardData || { date: new Date().toISOString().split('T')[0] }} />
              <SrfChart meta={dashboardData || { date: new Date().toISOString().split('T')[0] }} />
              <FundingChart meta={dashboardData || { date: new Date().toISOString().split('T')[0] }} />
            </div>
          </>
        )}
      
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