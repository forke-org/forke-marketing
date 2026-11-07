"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDocs } from "./DocsProvider";

export default function Shortcuts() {
  const { order, modal, openSearch, openAsk, openHelp, closeModal, toggleTheme, setNavOpen } = useDocs();
  const router = useRouter(), path = usePathname();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement, typing = ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName) || el.isContentEditable;
      const k = e.key;
      if ((e.metaKey || e.ctrlKey) && k.toLowerCase() === "k") { e.preventDefault(); modal === "search" ? closeModal() : openSearch(); return; }
      if (k === "Escape") { closeModal(); setNavOpen(false); return; }
      if (typing || modal || e.metaKey || e.ctrlKey || e.altKey) return;
      const slug = path.startsWith("/docs/") ? path.split("/")[2] : null, i = slug ? order.indexOf(slug) : -1;
      if (k === "/") { e.preventDefault(); openSearch(); }
      else if (k === "?") openHelp();
      else if (k.toLowerCase() === "a") { e.preventDefault(); openAsk(); }
      else if (k.toLowerCase() === "t") toggleTheme();
      else if (k === "[") { if (i > 0) router.push(`/docs/${order[i - 1]}`); else if (i === 0) router.push("/docs"); }
      else if (k === "]") { if (i >= 0 && i < order.length - 1) router.push(`/docs/${order[i + 1]}`); else if (path === "/docs") router.push(`/docs/${order[0]}`); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [order, modal, openSearch, openAsk, openHelp, closeModal, toggleTheme, setNavOpen, router, path]);
  return null;
}
