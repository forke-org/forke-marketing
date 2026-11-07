"use client";
import Link from "next/link";
import { useState } from "react";

const STEPS = [
  { n: "Claim", d: "Pick a task you are eligible for. It is reserved for you, and you have 20 minutes to activate it.", slug: "claiming-a-task", t: "Claiming a task" },
  { n: "Build", d: "Work in your isolated Forke branch. You never touch the owner’s main branch.", slug: "branch-workflow", t: "Forke branch workflow" },
  { n: "Submit", d: "Open a pull request from your branch and link it to the task.", slug: "submitting-a-pr", t: "Submitting a pull request" },
  { n: "Review", d: "Four layers check the work, then the owner reads a plain-English verdict card.", slug: "review-pipeline", t: "The 4-layer review pipeline" },
  { n: "Get paid", d: "The PR merges, escrow releases to your UPI, and you earn XP.", slug: "escrow-system", t: "Razorpay escrow and lockup" },
];

export default function Lifecycle() {
  const [i, setI] = useState(0);
  return (
    <div className="w-card">
      <div className="w-head"><b>How a task flows</b><span className="w-tag">Select a stage</span></div>
      <div className="w-body">
        <ol className="grid grid-cols-5 gap-2 max-[860px]:overflow-auto">
          {STEPS.map((s, j) => (
            <li key={s.n}>
              <button aria-pressed={j === i} onClick={() => setI(j)}
                className={`flex w-full flex-col items-center gap-2 rounded-[10px] border px-1 py-3 text-[13.5px] transition-colors ${j === i ? "border-accent bg-sel text-fg" : "border-line text-muted hover:border-line2 hover:text-fg"}`}>
                <i className={`grid size-[26px] place-items-center rounded-full border font-mono text-xs not-italic ${j === i ? "border-accent bg-accent text-accent-ink" : j < i ? "border-accent bg-sel text-accent-text" : "border-line2"}`}>{j + 1}</i>
                {s.n}
              </button>
            </li>
          ))}
        </ol>
        <div>
          <p className="mb-2 text-fg">{STEPS[i].d}</p>
          <Link href={`/docs/${STEPS[i].slug}`} className="text-sm text-accent-text">Read: {STEPS[i].t}</Link>
        </div>
      </div>
    </div>
  );
}
