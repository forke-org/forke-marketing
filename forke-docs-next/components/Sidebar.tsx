"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Icon from "./Icon";
import { RANKS, rankOf, useDocs, type Theme } from "./DocsProvider";

const THEMES: { id: Theme; icon: string; label: string }[] = [
  { id: "light", icon: "sun", label: "Light" }, { id: "dark", icon: "moon", label: "Dark" }, { id: "system", icon: "system", label: "System" },
];

export default function Sidebar() {
  const { nav, pages, order, seen, theme, setTheme, openSearch, navOpen, setNavOpen } = useDocs();
  const path = usePathname();
  const active = path.startsWith("/docs/") ? path.split("/")[2] : "home";
  const n = Object.keys(seen).filter((s) => pages[s]).length;
  const pct = Math.round((n / order.length) * 100);
  const [mac, setMac] = useState(false);
  useEffect(() => setMac(/Mac|iPhone|iPad/.test(navigator.platform)), []);
  const close = () => setNavOpen(false);

  return (
    <aside className={`fixed inset-y-0 left-0 z-30 flex w-[290px] flex-col gap-4 border-r border-line bg-bg px-3.5 pb-3.5 pt-5 transition-transform min-[861px]:sticky min-[861px]:top-0 min-[861px]:h-screen min-[861px]:w-auto min-[861px]:translate-x-0 ${navOpen ? "translate-x-0" : "-translate-x-full"}`}>
      <Link href="/docs" onClick={close} className="flex items-baseline px-2 font-mono text-[21px] font-bold tracking-tight">
        forke<span className="text-accent">*</span><em className="ml-2.5 font-sans text-[12.5px] font-medium not-italic tracking-normal text-muted">Help Center</em>
      </Link>

      <button onClick={() => { close(); openSearch(); }} className="flex w-full items-center gap-2.5 rounded-[10px] border border-line bg-panel px-2.5 py-2 text-muted transition-colors hover:border-line2">
        <Icon name="search" /><span>Search</span><kbd className="kbd ml-auto">{mac ? "⌘ K" : "Ctrl K"}</kbd>
      </button>

      <div className="-mt-1 mx-0.5 rounded-[10px] border border-line bg-panel px-3 py-2.5" title="Read pages to earn docs XP">
        <div className="flex justify-between text-[12.5px] text-muted"><b className="font-semibold text-fg">{RANKS[rankOf(n, order.length)]}</b><span>{n}/{order.length} read</span></div>
        <div className="mt-2 h-1 overflow-hidden rounded bg-raise"><i className="block h-full rounded bg-accent transition-[width] duration-500" style={{ width: `${pct}%` }} /></div>
      </div>

      <nav aria-label="Documentation" className="-mx-1.5 flex-1 overflow-auto px-1.5 pb-2 [scrollbar-color:var(--line2)_transparent] [scrollbar-width:thin]">
        <Link href="/docs" onClick={close} className={`flex items-center gap-[9px] rounded-lg px-2.5 py-1.5 text-sm font-medium ${active === "home" ? "bg-sel text-accent-text" : "text-fg hover:bg-panel"}`}>
          <Icon name="home" className="size-4 text-muted" />Docs home
        </Link>
        {nav.map((g) => (
          <div key={g.group} className="mt-5">
            <h3 className="flex items-center gap-[9px] px-2.5 py-1.5 text-[13.5px] font-semibold"><Icon name={g.icon} className="size-4 text-muted" />{g.group}</h3>
            {g.pages.map((s) => (
              <Link key={s} href={`/docs/${s}`} onClick={close}
                className={`mt-px flex items-start justify-between gap-2 rounded-lg px-2.5 py-1.5 text-sm transition-colors ${active === s ? "bg-sel font-medium text-accent-text" : "text-muted hover:bg-panel hover:text-fg"}`}>
                <span>{pages[s].title}</span>
                {seen[s] && <i className="mt-[9px] size-1.5 shrink-0 rounded-full bg-accent opacity-55" aria-label="read" />}
              </Link>
            ))}
          </div>
        ))}
      </nav>

      <div className="grid gap-3 border-t border-line pt-3">
        <a href="https://www.forke.space/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-[10px] border border-line bg-panel px-3 py-2.5 text-[13.5px] hover:border-accent">
          Back to Forke app <Icon name="ext" />
        </a>
        <div className="flex items-center justify-between">
          <a href="https://github.com/forke-org" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="grid size-[30px] place-items-center rounded-lg text-muted hover:bg-panel hover:text-fg"><Icon name="github" /></a>
          <div className="flex gap-0.5" role="group" aria-label="Theme">
            {THEMES.map((t) => (
              <button key={t.id} onClick={() => setTheme(t.id)} aria-label={t.label} className={`grid size-[30px] place-items-center rounded-lg ${theme === t.id ? "bg-raise text-fg" : "text-muted hover:bg-panel hover:text-fg"}`}><Icon name={t.icon} /></button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
