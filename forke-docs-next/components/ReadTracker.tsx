"use client";
import { useEffect } from "react";
import { useDocs } from "./DocsProvider";

/** Records the visit and awards docs XP after 6s on the page or scrolling to the end. */
export default function ReadTracker({ slug }: { slug: string }) {
  const { award, pushRecent } = useDocs();
  useEffect(() => {
    pushRecent(slug);
    const t = setTimeout(() => award(slug), 6000);
    const onScroll = () => {
      const h = document.documentElement;
      if (h.scrollHeight - h.clientHeight > 0 && window.scrollY >= h.scrollHeight - h.clientHeight - 160) award(slug);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { clearTimeout(t); window.removeEventListener("scroll", onScroll); };
  }, [slug, award, pushRecent]);
  return null;
}
