"use client";
import { useEffect, useRef, useState } from "react";

const G = [
  { n: "Static analysis", d: "Build, lint and scope checks", f: "Scope check failed: 2 files changed outside the task scope." },
  { n: "AI test generation", d: "Generated tests run against your diff", f: "2 of 14 generated tests failed." },
  { n: "Security scanning", d: "Scans the submission for security flags", f: "1 high-severity flag found." },
  { n: "Verdict card", d: "Plain-English summary for the owner", f: "" },
];
type St = "" | "run" | "pass" | "fail";
const LOG: Record<string, string> = { cmd: "text-fg", dim: "text-dim", ok: "text-green-600 dark:text-green-400", bad: "text-red-600 dark:text-red-400", pay: "text-accent-text" };

export default function Pipeline() {
  const [fail, setFail] = useState([false, false, false]);
  const [st, setSt] = useState<St[]>(["", "", "", ""]);
  const [log, setLog] = useState<{ c: string; t: string }[]>([]);
  const [running, setRunning] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  function run() {
    timers.current.forEach(clearTimeout); timers.current = [];
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const at = (fn: () => void, ms: number) => timers.current.push(setTimeout(fn, reduced ? 0 : ms));
    const add = (c: string, t: string) => setLog((l) => [...l, { c, t }]);
    const set = (i: number, s: St) => setSt((x) => x.map((v, j) => (j === i ? s : v)));
    setSt(["", "", "", ""]); setRunning(true);
    setLog([{ c: "cmd", t: "$ git push origin forke/task-2841" }, { c: "dim", t: "PR #42 linked to task. Running review pipeline…" }]);
    let t = 500, failed = false;
    for (let i = 0; i < 4 && !failed; i++) {
      const bad = i < 3 && fail[i];
      at(() => set(i, "run"), t); t += 750;
      at(() => { set(i, bad ? "fail" : "pass"); add(bad ? "bad" : "ok", `${bad ? "✗" : "✓"} ${G[i].n}${bad ? ": " + G[i].f : ""}`); }, t);
      if (bad) { failed = true; t += 400; at(() => { add("dim", "Submission sent back. Fix it, push again and the layers re-run."); setRunning(false); }, t); }
    }
    if (!failed) {
      t += 400; at(() => { add("dim", "task completion 9.2/10 · code quality 8.7/10 · scope respected · 0 security flags"); add("dim", "risk: low. Recommended: approve."); }, t);
      t += 800; at(() => { add("pay", "Owner approved → PR merged → ₹800 released to your UPI  +150 XP"); setRunning(false); }, t);
    }
  }

  const ring: Record<St, string> = {
    "": "border-line2", run: "animate-spin-fast border-accent border-t-transparent",
    pass: "border-green-500 bg-green-500 text-[#04130a] after:content-['✓']", fail: "border-red-500 bg-red-500 text-white after:content-['✕']",
  };
  return (
    <div className="w-card">
      <div className="w-head"><b>Try the review pipeline</b><span className="w-tag">Simulation</span></div>
      <div className="w-body">
        <ul className="grid gap-2">
          {G.map((g, i) => (
            <li key={g.n} className={`flex items-center gap-3 rounded-[10px] border px-3 py-2.5 transition-colors ${st[i] === "run" ? "border-accent" : st[i] === "fail" ? "border-red-500" : "border-line"}`}>
              <span className={`grid size-[18px] shrink-0 place-items-center rounded-full border-2 text-[11px] font-bold ${ring[st[i]]}`} />
              <div className="min-w-0 flex-1"><b className="block text-sm">{i + 1}. {g.n}</b><small className="text-[12.5px] text-muted">{g.d}</small></div>
              {i < 3 && (
                <label className="flex cursor-pointer items-center gap-2 text-[12.5px] text-muted">
                  <input type="checkbox" checked={fail[i]} disabled={running} onChange={(e) => setFail((f) => f.map((v, j) => (j === i ? e.target.checked : v)))} className="size-[15px] accent-accent" />Make it fail
                </label>
              )}
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap items-center gap-2.5">
          <button className="btn btn-primary" disabled={running} onClick={run}>Submit PR</button>
          <span className="text-[13px] text-dim">Flip a switch to see what a failure looks like.</span>
        </div>
        <div className="overflow-hidden rounded-xl border border-line bg-code">
          <div aria-live="polite" className="min-h-12 overflow-auto px-4 py-3.5 font-mono text-[13px] leading-[1.8] text-muted">
            {log.map((l, i) => <div key={i} className={LOG[l.c]}>{l.t}</div>)}
          </div>
        </div>
      </div>
    </div>
  );
}
