"use client";
import { useEffect, useState } from "react";
import Icon from "./Icon";

export default function Toc({ heads }: { heads: { id: string; text: string; level: number }[] }) {
  const [active, setActive] = useState("");
  useEffect(() => {
    const obs = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: "0px 0px -70% 0px" });
    heads.forEach((h) => { const el = document.getElementById(h.id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [heads]);
  if (!heads.length) return <aside />;
  return (
    <aside aria-label="On this page" className="sticky top-11 self-start text-[13px] max-[1100px]:hidden">
      <h4 className="mb-3 flex items-center gap-2 font-medium text-muted"><Icon name="toc" />On this page</h4>
      <ul className="border-l border-line">
        {heads.map((h) => (
          <li key={h.id}>
            <a href={`#${h.id}`} className={`-ml-px block border-l py-1 ${h.level === 3 ? "pl-7" : "pl-3.5"} ${active === h.id ? "border-accent text-accent-text" : "border-transparent text-muted hover:text-fg"}`}>{h.text}</a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
