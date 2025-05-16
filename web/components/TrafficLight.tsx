"use client";

export default function Light({status}:{status:"green"|"amber"|"red"}){
  const bg={green:'light-green',amber:'light-amber',red:'light-red'}[status];
  const ring={green:'status-green',amber:'status-amber',red:'status-red'}[status];
  return <span className={`inline-block w-3 h-3 rounded-full bg-${bg} ring-2 ring-${ring}`}/>;
} 