"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { Group, IndexEntry, PageMeta } from "@/lib/docs";

export type Theme = "light" | "dark" | "system";
type Modal = null | "search" | "ask" | "help";
type Toast = { id: number; msg: string; out?: boolean };
export const RANKS = ["Newcomer", "Code Runner", "Merge Specialist", "Runtime Knight", "Forke Legend"];
export const rankOf = (n: number, total: number) => (n >= total ? 4 : Math.min(3, Math.floor((n / total) * 4)));

type Ctx = {
  nav: Group[]; pages: Record<string, PageMeta>; order: string[]; index: IndexEntry[];
  theme: Theme; setTheme: (t: Theme) => void; toggleTheme: () => void;
  seen: Record<string, number>; award: (slug: string) => void; resetProgress: () => void;
  fb: Record<string, "up" | "down">; setFeedback: (slug: string, v: "up" | "down") => void;
  recent: string[]; pushRecent: (slug: string) => void;
  toasts: Toast[]; toast: (msg: string) => void;
  modal: Modal; openSearch: () => void; openAsk: (q?: string) => void; openHelp: () => void; closeModal: () => void;
  askReq: { q?: string; n: number };
  navOpen: boolean; setNavOpen: (v: boolean) => void;
};
const C = createContext<Ctx | null>(null);
export function useDocs() {
  const c = useContext(C);
  if (!c) throw new Error("useDocs must be used inside <DocsProvider>");
  return c;
}

const applyTheme = (t: Theme) =>
  document.documentElement.setAttribute("data-theme", t === "system" ? (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark") : t);

export function DocsProvider({ nav, pages, order, index, children }: { nav: Group[]; pages: Record<string, PageMeta>; order: string[]; index: IndexEntry[]; children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [seen, setSeen] = useState<Record<string, number>>({});
  const [fb, setFb] = useState<Record<string, "up" | "down">>({});
  const [recent, setRecent] = useState<string[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [modal, setModal] = useState<Modal>(null);
  const [askReq, setAskReq] = useState<{ q?: string; n: number }>({ n: 0 });
  const [navOpen, setNavOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const seenRef = useRef(seen);
  const toastId = useRef(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("forke-docs-state");
      if (raw) {
        const s = JSON.parse(raw);
        if (s.seen) { seenRef.current = s.seen; setSeen(s.seen); }
        if (s.fb) setFb(s.fb);
        if (Array.isArray(s.recent)) setRecent(s.recent);
      }
      const t = localStorage.getItem("forke-docs-theme") as Theme | null;
      if (t) setThemeState(t);
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem("forke-docs-state", JSON.stringify({ seen, fb, recent })); } catch {}
  }, [ready, seen, fb, recent]);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t); applyTheme(t);
    try { localStorage.setItem("forke-docs-theme", t); } catch {}
  }, []);
  const toggleTheme = useCallback(() => setTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark"), [setTheme]);

  const toast = useCallback((msg: string) => {
    const id = ++toastId.current;
    setToasts((t) => [...t, { id, msg }]);
    setTimeout(() => setToasts((t) => t.map((x) => (x.id === id ? { ...x, out: true } : x))), 2600);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2900);
  }, []);

  const award = useCallback((slug: string) => {
    if (!pages[slug] || seenRef.current[slug]) return;
    const total = order.length, before = rankOf(Object.keys(seenRef.current).length, total);
    seenRef.current = { ...seenRef.current, [slug]: Date.now() };
    setSeen(seenRef.current);
    toast(`+20 XP · ${pages[slug].title}`);
    const after = rankOf(Object.keys(seenRef.current).length, total);
    if (after !== before) setTimeout(() => toast(`Docs rank up: ${RANKS[after]}`), 1500);
  }, [pages, order, toast]);

  const resetProgress = useCallback(() => { seenRef.current = {}; setSeen({}); setFb({}); setModal(null); toast("Progress reset"); }, [toast]);
  const setFeedback = useCallback((slug: string, v: "up" | "down") => setFb((f) => ({ ...f, [slug]: v })), []);
  const pushRecent = useCallback((slug: string) => setRecent((r) => (r[0] === slug ? r : [slug, ...r.filter((x) => x !== slug)].slice(0, 5))), []);

  const value = useMemo<Ctx>(() => ({
    nav, pages, order, index, theme, setTheme, toggleTheme, seen, award, resetProgress, fb, setFeedback, recent, pushRecent, toasts, toast,
    modal, openSearch: () => setModal("search"), openAsk: (q) => { setAskReq((r) => ({ q, n: r.n + 1 })); setModal("ask"); },
    openHelp: () => setModal("help"), closeModal: () => setModal(null), askReq, navOpen, setNavOpen,
  }), [nav, pages, order, index, theme, setTheme, toggleTheme, seen, award, resetProgress, fb, setFeedback, recent, pushRecent, toasts, toast, modal, askReq, navOpen]);

  return <C.Provider value={value}>{children}</C.Provider>;
}
