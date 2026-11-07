"use client";
import Icon from "./Icon";
import { useDocs } from "./DocsProvider";

export default function Feedback({ slug }: { slug: string }) {
  const { fb, setFeedback } = useDocs();
  const v = fb[slug];
  if (v) return <p className="mt-12 text-[13.5px] text-muted">{v === "up" ? "Thanks for the feedback." : <>Sorry about that. <a className="text-accent-text" href="https://www.forke.space/contact" target="_blank" rel="noopener noreferrer">Tell the team what was missing</a>.</>}</p>;
  const b = "grid size-8 place-items-center rounded-lg border border-line2 hover:border-accent hover:text-accent-text";
  return (
    <div className="mt-12 flex items-center gap-2 text-[13.5px] text-muted">
      <span className="mr-1.5">Was this page helpful?</span>
      <button className={b} aria-label="Yes" onClick={() => setFeedback(slug, "up")}><Icon name="up" /></button>
      <button className={b} aria-label="No" onClick={() => setFeedback(slug, "down")}><Icon name="down" /></button>
    </div>
  );
}
