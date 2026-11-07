"use client";
import { useDocs } from "./DocsProvider";
export default function Toasts() {
  const { toasts } = useDocs();
  return (
    <div aria-live="polite" className="pointer-events-none fixed bottom-[26px] left-1/2 z-[100] grid -translate-x-1/2 justify-items-center gap-2 max-[860px]:bottom-[78px]">
      {toasts.map((t) => (
        <div key={t.id} className={`animate-pop rounded-full border border-line2 bg-panel px-4 py-[9px] text-[13.5px] shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-opacity duration-300 ${t.out ? "opacity-0" : ""}`}>{t.msg}</div>
      ))}
    </div>
  );
}
