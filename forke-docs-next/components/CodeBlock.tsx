"use client";
import { useState } from "react";

export default function CodeBlock({ lang, code }: { lang: string; code: string }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(code); setDone(true); setTimeout(() => setDone(false), 1400); } catch {}
  };
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-code">
      <header className="flex items-center justify-between border-b border-line py-[7px] pl-3.5 pr-2 font-mono text-xs text-dim">
        <span>{lang || "text"}</span>
        <button onClick={copy} className="rounded-md px-2 py-[3px] font-sans text-xs text-muted hover:bg-raise hover:text-fg">{done ? "Copied" : "Copy"}</button>
      </header>
      <pre className="overflow-auto px-4 py-3.5 font-mono text-[13px] leading-[1.7] text-fg"><code>{code}</code></pre>
    </div>
  );
}
