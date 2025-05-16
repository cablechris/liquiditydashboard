"use client";

import { useState } from "react";
export default function Bullet({value,floor}:{value:number;floor:number}){
  const pct=Math.min(value/floor,1);const [hover,set]=useState(false);
  return(
    <div className="relative h-3 bg-slate-200 rounded-full" onMouseEnter={()=>set(true)} onMouseLeave={()=>set(false)}>
      <div className="absolute inset-0"><div style={{width:`${pct*100}%`}} className="bg-status-green rounded-full"/></div>
      <div style={{left:`${pct*100}%`}} className="absolute -top-[3px] w-[2px] h-3 bg-slate-800"/>
      {hover&&<div className="absolute left-1/2 -translate-x-1/2 -top-6 text-[10px] bg-white px-1 border rounded shadow">{value.toLocaleString()} / floor</div>}
    </div>
  );} 