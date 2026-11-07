"use client";
import { useState } from "react";

const TIERS = [
  { a: 1, b: 5, n: "Early Game", m: "1.0x", r: "₹200 – ₹500", f: "HTML/CSS, basic bug fixes" },
  { a: 6, b: 10, n: "Mid Game", m: "1.2x", r: "₹500 – ₹1,200", f: "React components, CSS logic" },
  { a: 11, b: 15, n: "Skilled Tier", m: "1.5x", r: "₹1,200 – ₹3,000", f: "API hooks, full-stack features" },
  { a: 16, b: 20, n: "Elite Tier", m: "2.0x", r: "₹3,000 – ₹8,000", f: "System architecture, database fixes" },
  { a: 21, b: 25, n: "Legend Tier", m: "2.5x", r: "₹8,000+", f: "Performance at scale, cloud DevOps" },
];
const UNLOCKS: [number, string][] = [
  [1, "Basic bounties"], [3, "Public profile URL"], [5, "Team task applications"], [6, "Intermediate payout tiers"], [6, "Warm standby queue access"],
  [10, "XP streak multipliers"], [11, "Reviewer pathway entry"], [12, "Priority task queue"], [15, "Elite bounty eligibility"], [16, "Advanced security clearance"],
  [18, "Team lead eligibility"], [20, "Mentor access"], [21, "Private invite-only projects"], [21, "Prestige reset options"], [21, "Commit Warlord status badge"],
];

export default function Levels() {
  const [l, setL] = useState(1);
  const t = TIERS.find((x) => l >= x.a && l <= x.b)!;
  const cells = [{ k: "Tier", v: t.n, s: t.f }, { k: "Bounty range", v: t.r, s: "tasks you can claim" }, { k: "XP multiplier", v: t.m, s: "on every approved task" }];
  return (
    <div className="w-card">
      <div className="w-head"><b>Level explorer</b><span className="w-tag">Drag the slider</span></div>
      <div className="w-body">
        <label className="flex items-center gap-3.5"><span className="min-w-[54px] text-sm text-muted">Level</span>
          <input type="range" min={1} max={25} value={l} onChange={(e) => setL(+e.target.value)} className="h-6 flex-1 accent-accent" />
          <output className="min-w-[70px] text-right font-mono text-lg font-semibold">{l}</output>
        </label>
        <dl className="grid grid-cols-3 gap-2.5 max-[860px]:grid-cols-1">
          {cells.map((c) => (
            <div key={c.k} className="stat"><dt className="text-[12.5px] text-muted">{c.k}</dt><dd className="my-0.5 font-mono text-xl font-semibold tracking-tight">{c.v}</dd><small className="text-xs text-dim">{c.s}</small></div>
          ))}
        </dl>
        <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5 max-[860px]:grid-cols-1">
          {UNLOCKS.map(([lv, name]) => (
            <li key={name} className={`flex items-baseline gap-2.5 text-[13.5px] ${l >= lv ? "text-fg" : "text-dim"}`}>
              <b className={`min-w-11 font-mono text-xs font-medium ${l >= lv ? "text-accent-text" : "text-dim"}`}>{l >= lv ? "✓" : `Lvl ${lv}`}</b>{name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
