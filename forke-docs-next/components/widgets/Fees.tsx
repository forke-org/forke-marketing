"use client";
import { useState } from "react";

const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");
const PRESETS = [200, 500, 1200, 3000, 8000];

export default function Fees() {
  const [v, setV] = useState(500);
  const cells = [
    { t: "Developer receives", d: inr(v), s: "100% of the bounty" },
    { t: "Platform fee", d: inr(v * 0.1), s: "10%, paid by the founder" },
    { t: "Founder pays", d: inr(v * 1.1), s: "bounty + fee into escrow" },
  ];
  return (
    <div className="w-card">
      <div className="w-head"><b>Fee calculator</b><span className="w-tag">Interactive</span></div>
      <div className="w-body">
        <label className="flex items-center gap-3.5"><span className="min-w-[54px] text-sm text-muted">Bounty</span>
          <input type="range" min={200} max={10000} step={50} value={v} onChange={(e) => setV(+e.target.value)} className="h-6 flex-1 accent-accent" />
          <output className="min-w-[70px] text-right font-mono text-lg font-semibold">{inr(v)}</output>
        </label>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button key={p} onClick={() => setV(p)} className={`rounded-full border px-3 py-1 text-[13px] ${p === v ? "border-accent bg-sel text-accent-text" : "border-line2 text-muted hover:text-fg"}`}>{inr(p)}</button>
          ))}
        </div>
        <div className="flex h-2.5 gap-0.5 overflow-hidden rounded-md"><i className="bg-accent" style={{ flex: 100 }} /><i className="bg-line2" style={{ flex: 10 }} /></div>
        <dl className="grid grid-cols-3 gap-2.5 max-[860px]:grid-cols-1">
          {cells.map((c) => (
            <div key={c.t} className="stat"><dt className="text-[12.5px] text-muted">{c.t}</dt><dd className="my-0.5 font-mono text-xl font-semibold tracking-tight">{c.d}</dd><small className="text-xs text-dim">{c.s}</small></div>
          ))}
        </dl>
      </div>
    </div>
  );
}
