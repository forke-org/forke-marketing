import Link from "next/link";
import DocFrame from "@/components/DocFrame";
import HomeAsk from "@/components/HomeAsk";
import HomeTerminal from "@/components/HomeTerminal";
import Icon from "@/components/Icon";
import { NAV, getAllMeta } from "@/lib/docs";

const POPULAR = ["welcome", "for-developers", "claiming-a-task", "review-pipeline", "escrow-system", "levels-and-unlocks"];

export default function DocsHome() {
  const pages = getAllMeta();
  const card = "rounded-[14px] border border-line bg-panel p-5 transition-all hover:-translate-y-0.5 hover:border-accent";
  return (
    <DocFrame wide>
      <section className="pt-[18px]">
        <h1 className="mb-3.5 max-w-[18ch] text-[clamp(30px,5vw,46px)] font-bold leading-[1.08] tracking-[-0.03em]">Everything you need to ship work, earn trust, and get paid.</h1>
        <p className="max-w-[60ch] text-[17px] leading-normal text-muted">Guides for developers and founders on Forke, the micro-task marketplace.</p>
        <HomeAsk />
        <HomeTerminal />
      </section>

      <section className="mt-[34px] grid grid-cols-2 gap-3.5 max-[860px]:grid-cols-1">
        <Link href="/docs/for-developers" className={`${card} grid gap-1.5`}>
          <b className="text-lg">I’m a developer</b><span className="text-[14.5px] text-muted">Claim bounties, ship PRs and get paid to your UPI.</span><em className="mt-2 text-[13px] not-italic text-accent-text">For developers</em>
        </Link>
        <Link href="/docs/for-founders" className={`${card} grid gap-1.5`}>
          <b className="text-lg">I’m a founder</b><span className="text-[14.5px] text-muted">Post scoped tasks, fund escrow and approve a plain-English verdict.</span><em className="mt-2 text-[13px] not-italic text-accent-text">For founders</em>
        </Link>
      </section>

      <h2 className="mb-3.5 mt-11 text-xl font-semibold tracking-tight">Popular</h2>
      <div className="grid grid-cols-3 gap-3 max-[860px]:grid-cols-1">
        {POPULAR.map((s) => (
          <Link key={s} href={`/docs/${s}`} className="flex flex-col gap-1.5 rounded-xl border border-line p-4 hover:border-line2 hover:bg-panel">
            <b className="text-[15px]">{pages[s].title}</b><span className="flex-1 text-[13.5px] leading-normal text-muted">{pages[s].description}</span><small className="text-[12.5px] text-dim">{pages[s].read} min read</small>
          </Link>
        ))}
      </div>

      <h2 className="mb-3.5 mt-11 text-xl font-semibold tracking-tight">Browse by topic</h2>
      <div className="grid grid-cols-4 gap-2.5 max-[860px]:grid-cols-2">
        {NAV.map((g) => (
          <Link key={g.group} href={`/docs/${g.pages[0]}`} className="grid gap-1 rounded-xl border border-line p-3.5 hover:border-accent">
            <Icon name={g.icon} className="mb-1.5 size-4 text-accent" /><b className="text-sm">{g.group}</b><small className="text-dim">{g.pages.length} articles</small>
          </Link>
        ))}
      </div>
    </DocFrame>
  );
}
