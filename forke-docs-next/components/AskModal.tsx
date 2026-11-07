"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Backdrop from "./Backdrop";
import Icon from "./Icon";
import { useDocs } from "./DocsProvider";
import { answer, type Answer } from "@/lib/search";

const ENDPOINT = process.env.NEXT_PUBLIC_ASK_ENDPOINT;

export default function AskModal() {
  const { modal } = useDocs();
  return modal === "ask" ? <AskPanel /> : null;
}

function AskPanel() {
  const { index, pages, askReq, closeModal } = useDocs();
  const path = usePathname();
  const slug = path.startsWith("/docs/") ? path.split("/")[2] : null;
  const [q, setQ] = useState<string | null>(null), [ans, setAns] = useState<Answer | null>(null), [typed, setTyped] = useState(""), [done, setDone] = useState(false);
  const [input, setInput] = useState("");
  const tok = useRef(0), timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const body = useRef<HTMLDivElement>(null);

  function ask(question: string) {
    question = question.trim(); if (!question) return;
    clearTimeout(timer.current);
    const t = ++tok.current;
    setQ(question); setAns(null); setTyped(""); setDone(false); setInput("");
    const finish = (a: Answer) => {
      if (t !== tok.current) return;
      setAns(a);
      const plain = a.paras.join("\n\n");
      if (a.none || !plain || matchMedia("(prefers-reduced-motion: reduce)").matches) { setTyped(plain); setDone(true); return; }
      let i = 0; const step = Math.max(3, Math.ceil(plain.length / 60));
      const tick = () => { if (t !== tok.current) return; i += step; setTyped(plain.slice(0, i)); if (i < plain.length) timer.current = setTimeout(tick, 16); else setDone(true); };
      tick();
    };
    const cur = slug && pages[slug] ? { slug, title: pages[slug].title, description: pages[slug].description, sections: index.filter((e) => e.slug === slug && e.heading).map((e) => e.heading).slice(0, 6) } : undefined;
    const local = () => finish(answer(index, question, cur));
    if (ENDPOINT) {
      const ctx = answer(index, question, cur).paras;
      fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question, context: ctx }) })
        .then((r) => r.json()).then((j) => finish({ paras: [j.answer || j.text || ""], srcs: [] })).catch(local);
    } else timer.current = setTimeout(local, 450);
  }

  useEffect(() => {
    if (askReq.q) ask(askReq.q);
    return () => { tok.current++; clearTimeout(timer.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [askReq.n]);
  useEffect(() => { if (body.current) body.current.scrollTop = 0; }, [done]);

  const sugg = [...(slug && pages[slug] ? ["Summarize this page"] : []), "How do I get paid?", "What is the 48-hour dispute window?", "How does the 20-minute claim timer work?"].slice(0, 3);

  return (
    <Backdrop>
      <div role="dialog" aria-label="Ask Forke" className="relative flex h-[min(640px,calc(100vh-40px))] w-[min(640px,calc(100vw-24px))] animate-pop flex-col rounded-[18px] border border-line2 bg-panel p-[22px] shadow-[0_30px_90px_rgba(0,0,0,0.5)]">
        <button onClick={closeModal} aria-label="Close" className="absolute right-4 top-4 grid size-7 place-items-center rounded-full bg-raise text-muted hover:text-fg"><Icon name="close" className="size-3.5" /></button>
        <div>
          <h2 className="flex items-center gap-2.5 text-[17px] font-semibold"><Icon name="spark" className="size-4 text-accent" />Ask Forke</h2>
          <p className="mt-0.5 text-sm text-muted">Help from the docs. No sign-in needed.</p>
        </div>

        <div ref={body} className="flex flex-1 flex-col overflow-auto py-[18px]">
          {q === null ? (
            <div className="m-auto w-full max-w-[400px] text-center">
              <Icon name="spark" className="mx-auto size-[30px] text-accent" />
              <h3 className="mb-1 mt-3 text-[22px] font-semibold tracking-tight">What can we help with?</h3>
              <p className="mb-[22px] text-muted">Ask anything about earning or hiring on Forke.</p>
              {sugg.map((s, i) => (
                <button key={s} onClick={() => ask(s)} className={`flex w-full items-center justify-between border-t border-line px-1 py-[13px] text-left text-[14.5px] hover:text-accent-text ${i === sugg.length - 1 ? "border-b" : ""}`}>
                  {s}<Icon name="ext" className="size-[13px] text-dim" />
                </button>
              ))}
            </div>
          ) : (
            <>
              <div className="mb-3.5 max-w-[85%] self-end rounded-[14px_14px_4px_14px] bg-raise px-3.5 py-[9px]">{q}</div>
              <div className="text-[14.5px] leading-[1.65]">
                {!ans && <span className="inline-flex gap-1">{[0, 1, 2].map((d) => <i key={d} className="size-1.5 animate-blink rounded-full bg-dim" style={{ animationDelay: `${d * 0.15}s` }} />)}</span>}
                {ans && !done && <p className="whitespace-pre-wrap">{typed}</p>}
                {ans && done && (ans.none ? (
                  <p>I couldn’t find that in the docs. Try rephrasing, or <a className="text-accent-text underline" href="https://www.forke.space/contact" target="_blank" rel="noopener noreferrer">contact the Forke team</a>.</p>
                ) : (
                  <>
                    {ans.paras.map((p, i) => <p key={i} className="[&+p]:mt-2.5">{p}</p>)}
                    <div className="mt-3.5 flex flex-wrap gap-1.5">
                      {ans.srcs.map((e) => (
                        <Link key={e.slug + e.anchor} href={`/docs/${e.slug}${e.anchor ? "#" + e.anchor : ""}`} onClick={closeModal}
                          className="rounded-full border border-line2 px-2.5 py-1 text-[12.5px] text-accent-text hover:bg-sel">{e.heading ? `${e.title} › ${e.heading}` : e.title}</Link>
                      ))}
                    </div>
                  </>
                ))}
              </div>
            </>
          )}
        </div>

        <form onSubmit={(e) => { e.preventDefault(); ask(input); }} className="rounded-[14px] border border-accent bg-bg px-3 pb-2.5 pt-3">
          <textarea autoFocus rows={2} value={input} onChange={(e) => setInput(e.target.value)} aria-label="Your question" placeholder="Ask about Forke…"
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); ask(input); } }}
            className="w-full resize-none bg-transparent text-[15px] leading-normal text-fg outline-none placeholder:text-dim" />
          <div className="flex items-center justify-between text-[12.5px] text-muted">
            <span>Each question starts fresh</span>
            <button type="submit" aria-label="Send" className="grid size-8 place-items-center rounded-full bg-accent text-accent-ink"><Icon name="send" /></button>
          </div>
        </form>
        <p className="mt-2.5 text-center text-xs text-dim">Answers come from these docs and can be wrong. Don’t share passwords or personal data.</p>
      </div>
    </Backdrop>
  );
}
