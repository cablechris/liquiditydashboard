'use client';
import React, { useState, useMemo } from 'react';
import { ResponsiveContainer, ComposedChart, Line, Bar, ReferenceLine, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
import series from "../../public/series/funding.json";
import { ACCENT } from '../../lib/palette';
import { differenceInCalendarDays, format } from 'date-fns';

export default function FundingChart({ meta }: { meta: any }) {
  const totalDays = series.length;
  const today = new Date();
  
  const ranges = [
    { label: 'YTD', days: differenceInCalendarDays(today, new Date(today.getFullYear(), 0, 1)) },
    { label: '1 Y', days: 365 },
    { label: '5 Y', days: 365 * 5 },
    { label: 'Max', days: totalDays },
  ];
  
  const [sel, setSel] = useState(ranges[2]);
  const data = useMemo(
    () => series.slice(-Math.min(sel.days, totalDays)),
    [sel.days, totalDays]
  );
  const color = ACCENT['funding'];
  const GRID = { stroke: '#e0e0e0', strokeDasharray: '3 3' };
  const tickInterval = data.length > 30 ? Math.floor(data.length / 30) : 0;
  
  return (
    <div id="chart-tail" className="mb-12">
      {/* Title */}
      <h3 className="text-2xl font-bold mb-4">Treasury Funding Conditions</h3>
      
      {/* Range buttons */}
      <div className="flex justify-end gap-2 mb-2 text-xs">
        {ranges.map(r => (
          <button
            key={r.label}
            onClick={() => setSel(r)}
            className={`px-2 py-1 rounded ${r.label===sel.label?'bg-slate-200':'hover:bg-slate-100'}`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={320}>
        <ComposedChart data={data}>
          <CartesianGrid stroke="#e0e0e0" strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="date" 
            interval={tickInterval}
            tickFormatter={(t) => format(new Date(t), 'MMM yyyy')}
            tick={{ fontSize: 11, fill: '#555' }}
          />
          
          {/* Primary Y-axis for bill share (left) */}
          <YAxis 
            yAxisId="left" 
            tick={{ fontSize: 11, fill: '#555' }} 
            domain={[0, 1]} 
            tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} 
          />
          
          {/* Secondary Y-axis for tail (right) */}
          <YAxis 
            yAxisId="right" 
            orientation="right" 
            tick={{ fontSize: 11, fill: '#555' }} 
            domain={[0, 'dataMax + 1']} 
            tickFormatter={(v) => `${v}bp`} 
          />
          
          {meta?.fomc && Array.isArray(meta.fomc) && meta.fomc.map((date: string) => (
            date && <ReferenceLine key={date} yAxisId="left" x={date} stroke="#94a3b8" strokeDasharray="3 3" />
          ))}
          
          {/* Bill share threshold */}
          <ReferenceLine 
            yAxisId="left" 
            y={0.6} 
            stroke="#eab308" 
            strokeDasharray="3 3" 
            label={{ value: 'Amber > 60%', position: 'insideBottomLeft', fill: '#eab308', fontSize: 10 }} 
          />
          
          {/* Tail threshold */}
          <ReferenceLine 
            yAxisId="right" 
            y={4} 
            stroke="#eab308" 
            strokeDasharray="3 3" 
            label={{ value: 'Amber >= 4bp', position: 'insideBottomRight', fill: '#eab308', fontSize: 10 }} 
          />
          
          {/* Bill share (bars) */}
          <Bar 
            dataKey="bill_share" 
            yAxisId="left" 
            fill={color} 
            fillOpacity={0.3} 
            name="Bill Share (%)" 
          />
          
          {/* Tail (line) */}
          <Line 
            dataKey="tail_bp" 
            yAxisId="right" 
            stroke={color} 
            strokeWidth={2} 
            dot={false} 
            name="Tail (bp)" 
          />
          
          <Tooltip 
            cursor={{ stroke: '#e0e0e0', strokeWidth: 1, strokeDasharray: '3 3' }}
            contentStyle={{ 
              background: '#ffffff', 
              border: '1px solid #e0e0e0', 
              fontSize: 12, 
              color: '#111', 
              boxShadow: '0 2px 6px rgba(0,0,0,0.08)' 
            }}
            formatter={(value, name) => {
              if (name === "Bill Share (%)") {
                return [`${(Number(value) * 100).toFixed(0)}%`, name];
              }
              return [value, name];
            }}
            labelFormatter={(l) => format(new Date(l as string), 'd MMM, yyyy')}
          />
          
          <Legend 
            verticalAlign="top" 
            height={36} 
            formatter={(value) => <span style={{fontSize: 12}}>{value}</span>} 
          />
        </ComposedChart>
      </ResponsiveContainer>

      <div className="mt-4 text-sm text-gray-600">
        <p className="mb-2">Treasury funding conditions are measured by two key metrics: Bill Share and Tail Performance. Bill Share represents the percentage of US government debt issued as short-term bills rather than longer-term notes and bonds. A high bill share (above 60%) indicates the Treasury may be struggling to place longer-term debt. Tail performance measures the spread between auction prices and pre-auction secondary market prices, with high values (above 4bp) signaling weak demand from primary dealers. Together, these metrics provide critical insights into market appetite for US government debt.</p>
        <p className="mt-3 font-medium italic border-l-4 border-indigo-600 pl-3">"The bill share-to-tail performance ratio is the canary in the Treasury market's coal mine. When the Treasury shifts issuance heavily toward bills while tails widen at auctions, it tells you the market is reaching its absorption capacity. This isn't just academic—it's the earliest warning sign that the world's most important market could be approaching dysfunction." — Brad Setser, Senior Fellow at the Council on Foreign Relations</p>
      </div>
    </div>
  );
} 