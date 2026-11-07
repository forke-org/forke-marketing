"use client";
import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";

export default function DocActions({ slug, md }: { slug: string; md: string }) {
  const [open, setOpen] = useState(false), [copied, setCopied] = useState(false), [origin, setOrigin] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const o = window.location.origin;
    setOrigin(/localhost|127\.0\.0\.1/.test(o) ? null : o); // local dev: LLMs can't reach the URL, so send the text instead
  }, []);
  useEffect(() => {
    const away = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", away); document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", away); document.removeEventListener("keydown", esc); };
  }, []);

  const prompt = origin
    ? `Read ${origin}/docs/${slug} so I can ask questions about it.`
    : `Here is a documentation page from Forke. Read it so I can ask questions about it.\n\n${md.slice(0, 5000)}`;
  const q = encodeURIComponent(prompt);
  const links = [
    { t: "Open in ChatGPT", icon: "gpt", href: `https://chatgpt.com/?q=${q}` },
    { t: "Open in Claude", icon: "claude", href: `https://claude.ai/new?q=${q}` },
    { t: "Open in Cursor", icon: "cursor", href: `https://cursor.com/link/prompt?text=${q}` },
  ];
  const item = "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-raise";

  return (
    <div ref={ref} className="relative flex shrink-0 gap-2 max-[860px]:mb-4">
      <button className="btn" onClick={async () => { try { await navigator.clipboard.writeText(md); setCopied(true); setTimeout(() => setCopied(false), 1400); } catch {} }}>
        <Icon name="copy" /><span>{copied ? "Copied" : "Copy Markdown"}</span>
      </button>
      <button className="btn" aria-haspopup="true" aria-expanded={open} onClick={() => setOpen((o) => !o)}>Open <Icon name="chevron" /></button>
      {open && (
        <div className="absolute right-0 top-[42px] z-20 min-w-[230px] rounded-xl border border-line2 bg-panel p-1.5 shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
          <a className={item} href={`/docs/md/${slug}`} target="_blank" rel="noopener noreferrer"><Icon name="page" /><span>View as Markdown</span><Icon name="ext" className="ml-auto size-3.5 text-dim" /></a>
          {links.map((l) => (
            <a key={l.t} className={item} href={l.href} target="_blank" rel="noopener noreferrer"><Icon name={l.icon} /><span>{l.t}</span><Icon name="ext" className="ml-auto size-3.5 text-dim" /></a>
          ))}
        </div>
      )}
    </div>
  );
}
