"use client";
import type { ReactNode } from "react";
import { useDocs } from "./DocsProvider";
export default function Backdrop({ children, align = "center" }: { children: ReactNode; align?: "start" | "center" }) {
  const { closeModal } = useDocs();
  return (
    <div onMouseDown={(e) => e.target === e.currentTarget && closeModal()} className={`fixed inset-0 z-[60] grid animate-fade justify-items-center bg-black/55 backdrop-blur-[3px] ${align === "start" ? "content-start" : "content-center"}`}>
      {children}
    </div>
  );
}
