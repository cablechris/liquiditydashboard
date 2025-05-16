import React from 'react';
import Thermometer from "@/components/Thermometer";
import MoveLine from "@/components/MoveLine";
import OnRrpChart from '@/components/charts/OnRrpChart';
import ReservesChart from '@/components/charts/ReservesChart';
import MoveChart from '@/components/charts/MoveChart';
import SrfChart from '@/components/charts/SrfChart';
import FundingChart from '@/components/charts/FundingChart';
import MicroDashStrip from '@/components/MicroDashStrip';
// @ts-ignore - Import JSON directly
import snap from "../public/dashboard.json";
// @ts-ignore - Import meta data
import meta from "../data/meta.json";

// Define the dashboard data interface
interface DashboardData {
  date: string;
  on_rrp: number;
  reserves: number;
  move: number;
  srf: number;
  bill_share: number;
  tail_bp: number;
  on_rrp_delta30: number | null;
  on_rrp_days_to_zero: number | null;
  reserves_wow: number | null;
  srf_ma7: number;
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
  return (
    <>
      <header className="bg-white py-16">
        <div className="container mx-auto flex flex-col md:flex-row items-start gap-12 px-4 md:px-0">
          {/* Text & MicroDash */}
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
            <img 
              src="/images/plumber-cartoon.png" 
              alt="USD Liquidity Plumbers"
              className="max-h-80 object-contain rounded-lg shadow-lg" 
            />
          </div>
        </div>
      </header>

      {/* ———  Charts  ——— */}
      <main className="container mx-auto px-4 md:px-0 space-y-12 mb-16">
        <details open className="chart-accordion bg-white border border-line rounded-xl p-4" id="chart-on_rrp">
          <summary className="font-semibold cursor-pointer mb-2">ON-RRP</summary>
          <OnRrpChart meta={meta} />
          <figcaption className="mt-2 text-sm text-slate-500">
            The <strong>Overnight Reverse Repo (ON-RRP)</strong> facility is where large money-market funds park 
            their cash at the Fed overnight in exchange for Treasury collateral—think of it as a giant, short-term 
            savings vault. When this pool drains below key thresholds ($100 B amber, $50 B red), stealth easing 
            has run its course—and the Fed must decide whether to open its balance sheet again.
          </figcaption>
        </details>
        
        <details open className="chart-accordion bg-white border border-line rounded-xl p-4" id="chart-reserves">
          <summary className="font-semibold cursor-pointer mb-2">Reserves</summary>
          <ReservesChart meta={meta} />
          <figcaption className="mt-2 text-sm text-slate-500">
            <strong>Reserves</strong> are the electronic balances commercial banks hold at the Fed, like an all-you-can-spend 
            checking account for the entire banking system. When reserves fall toward $2.5 T, funding markets tighten, 
            overnight loan rates spike, and the Fed typically steps in to keep the wheels turning.
          </figcaption>
        </details>
        
        <details open className="chart-accordion bg-white border border-line rounded-xl p-4" id="chart-move">
          <summary className="font-semibold cursor-pointer mb-2">MOVE Index</summary>
          <MoveChart meta={meta} />
          <figcaption className="mt-2 text-sm text-slate-500">
            The <strong>MOVE index</strong> measures expected swings in Treasury yields over the next month—it's the 
            bond-market's VIX. A calm reading (&lt;120 amber) gives comfort; a jump above 140 (red) has preceded each 
            major liquidity backstop—from COVID to SVB week—making MOVE your red-flag gauge.
          </figcaption>
        </details>
        
        <details open className="chart-accordion bg-white border border-line rounded-xl p-4" id="chart-srf">
          <summary className="font-semibold cursor-pointer mb-2">SRF Take-up</summary>
          <SrfChart meta={meta} />
          <figcaption className="mt-2 text-sm text-slate-500">
            The <strong>Standing Repo Facility (SRF)</strong> is the Fed's 24-hour "lending window" for dealers when 
            private funding fails. Under normal conditions it sits idle; usage above $25 B (amber) or $100 B (red) 
            signals serious clogging in wholesale funding markets.
          </figcaption>
        </details>
        
        <details open className="chart-accordion bg-white border border-line rounded-xl p-4" id="chart-tail">
          <summary className="font-semibold cursor-pointer mb-2">Treasury Funding</summary>
          <FundingChart meta={meta} />
          <figcaption className="mt-2 text-sm text-slate-500">
            This <strong>Treasury funding mix & auction tails</strong> chart shows two stress signals: a high bill share 
            (&gt;60 %) and a large auction "tail" (≥4 bp). When both turn red, private investors are tapped out—leaving 
            the Fed as buyer-of-last-resort.
          </figcaption>
        </details>
      
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