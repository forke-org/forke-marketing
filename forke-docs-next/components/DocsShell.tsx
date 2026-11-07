"use client";
import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Icon from "./Icon";
import Sidebar from "./Sidebar";
import CommandPalette from "./CommandPalette";
import AskModal from "./AskModal";
import HelpModal from "./HelpModal";
import Toasts from "./Toasts";
import Shortcuts from "./Shortcuts";
import { useDocs } from "./DocsProvider";

function ProgressBar() {
  const ref = useRef<HTMLDivElement>(null);
  const path = usePathname();
  useEffect(() => {
    const f = () => {
      const h = document.documentElement, max = h.scrollHeight - h.clientHeight;
      if (ref.current) ref.current.style.width = `${max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0}%`;
    };
    f(); window.addEventListener("scroll", f, { passive: true }); window.addEventListener("resize", f);
    return () => { window.removeEventListener("scroll", f); window.removeEventListener("resize", f); };
  }, [path]);
  return <div ref={ref} className="fixed left-0 top-0 z-90 h-0.5 w-0 bg-accent transition-[width] duration-75" />;
}

export default function DocsShell({ children }: { children: ReactNode }) {
  const { navOpen, setNavOpen, openSearch, openAsk } = useDocs();
  return (
    <>
      <ProgressBar />
      <div className="min-h-screen min-[861px]:grid min-[861px]:grid-cols-[272px_1fr]">
        <header className="sticky top-0 z-20 flex h-[54px] items-center justify-between border-b border-line bg-bg px-3 min-[861px]:hidden">
          <button onClick={() => setNavOpen(true)} aria-label="Open menu" className="grid size-9 place-items-center rounded-[9px] text-muted"><Icon name="menu" /></button>
          <Link href="/docs" className="font-mono text-xl font-bold tracking-tight">forke<span className="text-accent">*</span> <em className="font-sans text-[12.5px] font-medium not-italic text-muted">Docs</em></Link>
          <button onClick={openSearch} aria-label="Search" className="grid size-9 place-items-center rounded-[9px] text-muted"><Icon name="search" /></button>
        </header>
        <Sidebar />
        {navOpen && <div onClick={() => setNavOpen(false)} className="fixed inset-0 z-[29] bg-black/50 min-[861px]:hidden" />}
        <main className="min-w-0 px-5 pt-5 max-[860px]:p-0">{children}</main>
      </div>

      <button onClick={() => openAsk()} className="fixed bottom-6 right-6 z-40 flex h-[42px] items-center gap-2 rounded-full bg-accent px-[18px] text-sm font-semibold text-accent-ink shadow-[0_10px_30px_rgba(255,122,0,0.35)] transition-transform hover:-translate-y-0.5 max-[860px]:bottom-3.5 max-[860px]:right-3.5">
        <Icon name="spark" />Ask AI
      </button>
      <CommandPalette /><AskModal /><HelpModal /><Toasts /><Shortcuts />
    </>
  );
}
