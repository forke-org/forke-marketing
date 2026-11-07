"use client";
import { useEffect, useState } from "react";

const LINES: [string, string][] = [
  ["cmd", "forke claim fix-navbar-overflow"], ["ok", "✓ reserved for you. Activate within 20:00"],
  ["cmd", "git push origin forke/task-2841"], ["ok", "✓ static analysis  ✓ ai tests  ✓ security  ✓ verdict"],
  ["cmd", "forke status"], ["pay", "PR #42 merged · ₹800 released to your UPI · +150 XP"],
];
type V = { k: string; t: string; caret: boolean };
const COLOR: Record<string, string> = { cmd: "text-fg", ok: "text-green-600 dark:text-green-400", pay: "text-accent-text" };

export default function HomeTerminal() {
  const [view, setView] = useState<V[]>([]);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { setView(LINES.map(([k, t]) => ({ k, t, caret: false }))); return; }
    setView([]);
    const timers: ReturnType<typeof setTimeout>[] = [];
    let t = 0;
    LINES.forEach(([k, text], li) => {
      if (k === "cmd") {
        t += 250; timers.push(setTimeout(() => setView((v) => [...v, { k, t: "", caret: true }]), t));
        for (let c = 1; c <= text.length; c++) { t += 28; timers.push(setTimeout(() => setView((v) => v.map((x, i) => (i === li ? { ...x, t: text.slice(0, c) } : x))), t)); }
        t += 150; timers.push(setTimeout(() => setView((v) => v.map((x, i) => (i === li ? { ...x, caret: false } : x))), t));
      } else { t += 320; timers.push(setTimeout(() => setView((v) => [...v, { k, t: text, caret: false }]), t)); }
    });
    return () => timers.forEach(clearTimeout);
  }, []);
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-code">
      <div className="flex items-center gap-1.5 border-b border-line px-3 py-[9px] font-mono text-xs text-dim">
        {[0, 1, 2].map((i) => <i key={i} className="size-[9px] rounded-full bg-line2" />)}<span className="ml-2">~/payday</span>
      </div>
      <div className="min-h-[196px] px-4 py-3.5 font-mono text-sm leading-[1.8]" aria-label="Example terminal session">
        {view.map((l, i) => (
          <div key={i} className={COLOR[l.k]}>
            {l.k === "cmd" && <span className="mr-2 text-accent">$</span>}{l.t}
            {l.caret && <span className="ml-0.5 inline-block h-[15px] w-[7px] animate-blink bg-accent align-[-2px]" />}
          </div>
        ))}
      </div>
    </div>
  );
}
