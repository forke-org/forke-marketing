"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Backdrop from "./Backdrop";
import Icon from "./Icon";
import { useDocs } from "./DocsProvider";
import { rank } from "@/lib/search";

type Item = { t: string; s: string; icon: string; k?: string; href?: string; run?: () => void };
type Row = { sec: string } | { item: Item; i: number };

export default function CommandPalette() {
  const { modal, closeModal, index, pages, order, recent, openAsk, openHelp, toggleTheme, toast } = useDocs();
  const router = useRouter(), path = usePathname();
  const [q, setQ] = useState(""), [sel, setSel] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);
  const open = modal === "search";
  useEffect(() => { if (open) { setQ(""); setSel(0); } }, [open]);

  const { rows, items } = useMemo(() => {
    const rows: Row[] = [], items: Item[] = [];
    const sec = (sec: string) => rows.push({ sec });
    const add = (item: Item) => { rows.push({ item, i: items.length }); items.push(item); };
    const slug = path.startsWith("/docs/") ? path.split("/")[2] : null;
    const term = q.trim();
    if (!term) {
      sec("Actions");
      add({ t: "Ask AI", s: "Ask a question about Forke", icon: "spark", k: "A", run: () => openAsk() });
      add({ t: "Toggle light / dark", s: "Switch theme", icon: "moon", k: "T", run: toggleTheme });
      add({ t: "Copy this page as Markdown", s: slug && pages[slug] ? pages[slug].title : "Open a page first", icon: "copy",
        run: () => { if (slug) fetch(`/docs/md/${slug}`).then((r) => r.text()).then((t) => navigator.clipboard.writeText(t)).then(() => toast("Page copied as Markdown")).catch(() => {}); } });
      add({ t: "Keyboard shortcuts", s: "See every shortcut", icon: "keys", k: "?", run: openHelp });
      const rec = recent.filter((s) => pages[s]), list = rec.length ? rec : order.slice(0, 6);
      sec(rec.length ? "Recent" : "Pages");
      list.forEach((s) => add({ t: pages[s].title, s: pages[s].group, icon: "page", href: `/docs/${s}` }));
    } else {
      const hits = rank(index, term, 7);
      if (hits.length) sec("Results");
      hits.forEach(({ e }) => add({ t: e.heading || e.title, s: e.heading ? e.title : e.text.slice(0, 90), icon: e.heading ? "hash" : "page", href: `/docs/${e.slug}${e.anchor ? "#" + e.anchor : ""}` }));
      sec("Not what you need?");
      add({ t: `Ask AI: “${term}”`, s: "Get an answer from the docs", icon: "spark", run: () => openAsk(term) });
    }
    return { rows, items };
  }, [q, path, index, pages, order, recent, openAsk, openHelp, toggleTheme, toast]);

  useEffect(() => { listRef.current?.querySelector(`[data-i="${sel}"]`)?.scrollIntoView({ block: "nearest" }); }, [sel]);
  if (!open) return null;

  const exec = (i: number) => {
    const it = items[i]; if (!it) return;
    closeModal();
    if (it.run) it.run(); else if (it.href) router.push(it.href);
  };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); setSel((s) => (s + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length); }
    else if (e.key === "Enter") { e.preventDefault(); exec(sel); }
  };

  return (
    <Backdrop align="start">
      <div role="dialog" aria-label="Search docs" className="mt-[12vh] flex max-h-[70vh] w-[min(620px,calc(100vw-24px))] animate-pop flex-col overflow-hidden rounded-[18px] border border-line2 bg-panel shadow-[0_30px_90px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-3 border-b border-line px-4 py-3.5 text-muted">
          <Icon name="search" />
          <input autoFocus value={q} onChange={(e) => { setQ(e.target.value); setSel(0); }} onKeyDown={onKey} placeholder="Search the docs…" autoComplete="off" aria-label="Search"
            className="flex-1 bg-transparent text-base text-fg outline-none placeholder:text-dim" />
          <kbd className="kbd">Esc</kbd>
        </div>
        <ul ref={listRef} className="overflow-auto p-2">
          {rows.map((r, n) => "sec" in r ? (
            <li key={`s${n}`} className="px-3 pb-1 pt-2.5 text-xs font-medium text-dim">{r.sec}</li>
          ) : (
            <li key={`i${n}`}>
              <button data-i={r.i} onMouseMove={() => setSel(r.i)} onClick={() => exec(r.i)}
                className={`flex w-full items-center gap-3 rounded-[10px] px-3 py-2.5 text-left ${sel === r.i ? "bg-sel" : ""}`}>
                <Icon name={r.item.icon} className="size-4 text-muted" />
                <span className="min-w-0 flex-1"><span className="block font-medium">{r.item.t}</span><small className="block truncate text-[12.5px] text-muted">{r.item.s}</small></span>
                {r.item.k && <kbd className="kbd">{r.item.k}</kbd>}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </Backdrop>
  );
}
