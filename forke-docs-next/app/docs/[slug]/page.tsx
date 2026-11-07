import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import DocActions from "@/components/DocActions";
import DocFrame from "@/components/DocFrame";
import Feedback from "@/components/Feedback";
import Markdown from "@/components/Markdown";
import ReadTracker from "@/components/ReadTracker";
import Toc from "@/components/Toc";
import { ORDER, fullMarkdown, getPage, headings } from "@/lib/docs";

type Props = { params: Promise<{ slug: string }> };

export const generateStaticParams = () => ORDER.map((slug) => ({ slug }));
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getPage((await params).slug);
  return p ? { title: p.title, description: p.description } : {};
}

export default async function DocPage({ params }: Props) {
  const { slug } = await params;
  const p = getPage(slug);
  if (!p) notFound();
  const i = ORDER.indexOf(slug), prev = i > 0 ? getPage(ORDER[i - 1]) : undefined, next = i < ORDER.length - 1 ? getPage(ORDER[i + 1]) : undefined;
  const pager = "block rounded-xl border border-line p-3.5 px-4 transition-colors hover:border-accent";
  return (
    <DocFrame toc={<Toc heads={headings(p.body)} />}>
      <ReadTracker slug={slug} />
      <div className="flex items-start justify-between gap-4 max-[860px]:flex-col">
        <div>
          <div className="text-[13.5px] font-medium text-accent-text">{p.group}<small className="ml-2.5 text-[12.5px] font-normal text-dim">{p.read} min read</small></div>
          <h1 className="mb-2.5 mt-2 text-[clamp(28px,4vw,38px)] font-bold leading-[1.15] tracking-[-0.025em]">{p.title}</h1>
        </div>
        <DocActions slug={slug} md={fullMarkdown(p)} />
      </div>
      <p className="max-w-[60ch] text-[17px] leading-normal text-muted">{p.description}</p>
      <Markdown body={p.body} />
      <Feedback slug={slug} />
      <nav aria-label="Pagination" className="mt-16 grid grid-cols-2 gap-3">
        {prev ? <Link href={`/docs/${prev.slug}`} className={pager}><small className="block text-[12.5px] text-muted">Previous</small><span className="font-semibold">{prev.title}</span></Link> : <span />}
        {next && <Link href={`/docs/${next.slug}`} className={`${pager} text-right`}><small className="block text-[12.5px] text-muted">Next</small><span className="font-semibold">{next.title}</span></Link>}
      </nav>
    </DocFrame>
  );
}
