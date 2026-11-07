"use client";
import { useState } from "react";
import Icon from "./Icon";
import { useDocs } from "./DocsProvider";

export default function HomeAsk() {
  const { openAsk } = useDocs();
  const [v, setV] = useState("");
  return (
    <form onSubmit={(e) => { e.preventDefault(); openAsk(v.trim() || undefined); setV(""); }}
      className="my-[26px] flex max-w-[560px] items-center gap-3 rounded-[14px] border border-line2 bg-panel py-1.5 pl-4 pr-2 transition-colors focus-within:border-accent">
      <Icon name="spark" className="size-4 text-accent" />
      <input value={v} onChange={(e) => setV(e.target.value)} placeholder="Ask anything about Forke…" aria-label="Ask the docs" autoComplete="off"
        className="h-10 min-w-0 flex-1 bg-transparent text-[15px] text-fg outline-none placeholder:text-dim" />
      <kbd className="kbd">Enter</kbd>
    </form>
  );
}
