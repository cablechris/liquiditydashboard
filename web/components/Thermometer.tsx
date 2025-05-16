"use client";

import React from 'react';

interface ThermometerProps {
  statuses: {
    on_rrp: string;
    reserves: string;
    move: string;
    srf: string;
    tail: string;
    [key: string]: string;
  };
}

export default function Thermometer({ statuses }: ThermometerProps) {
  // Calculate the overall status based on individual metric statuses with weights
  const statusValues = Object.entries(statuses);
  const scoreMap = { "green": 1, "amber": 0.5, "red": 0 };
  
  // Apply weights: 1.5x for ON-RRP and MOVE, 1x for others
  const weightedScores = statusValues.map(([key, status]) => {
    const weight = (key === "on_rrp" || key === "move") ? 1.5 : 1;
    return scoreMap[status as keyof typeof scoreMap] * weight;
  });
  
  // Calculate total weighted score and max possible score
  const totalScore = weightedScores.reduce((acc, score) => acc + score, 0);
  const maxScore = statusValues.reduce((acc, [key, _]) => {
    return acc + ((key === "on_rrp" || key === "move") ? 1.5 : 1);
  }, 0);
  
  // Calculate percentage (0-100)
  const pct = (totalScore / maxScore) * 100;
  
  // Determine overall status
  let overallStatus = "green";
  if (pct < 40) {
    overallStatus = "red";
  } else if (pct < 70) {
    overallStatus = "amber";
  }
  
  // Calculate the fill level based on percentage
  const fillPercent = pct;
  
  return (
    <div className="flex flex-col items-center p-4">
      <h3 className="text-sm font-medium mb-2">Liquidity Status</h3>
      <div className="w-8 h-40 bg-gray-200 rounded-full relative overflow-hidden">
        <div 
          className={`absolute bottom-0 w-full bg-status-${overallStatus} transition-all duration-500 ease-in-out rounded-b-full`}
          style={{ height: `${fillPercent}%` }}
        />
        {/* Thermometer markings */}
        <div className="absolute inset-0 flex flex-col justify-between py-3">
          <div className="w-3 h-px bg-gray-400 self-center" />
          <div className="w-3 h-px bg-gray-400 self-center" />
          <div className="w-3 h-px bg-gray-400 self-center" />
        </div>
        {/* Thermometer bulb */}
        <div className={`absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-status-${overallStatus} border-2 border-gray-200`} />
      </div>
      <div className={`mt-10 text-sm font-semibold text-status-${overallStatus}`}>
        {overallStatus === "red" ? "Low" : 
         overallStatus === "amber" ? "Moderate" : "High"} Liquidity
      </div>
      <div className="flex items-center justify-between text-[10px] mt-1 w-full">
        <p>{pct.toFixed(0)} / 100</p>
        <p title="Score = 1×(Res+SRF+Funding) + 1.5×(ON‑RRP+MOVE)">formula</p>
      </div>
      <div className="mt-2 text-xs text-gray-500">
        Weighted: 1.5× ON-RRP & MOVE
      </div>
    </div>
  );
} 