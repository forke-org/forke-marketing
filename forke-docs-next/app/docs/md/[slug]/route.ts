import { ORDER, fullMarkdown, getPage } from "@/lib/docs";

export const generateStaticParams = () => ORDER.map((slug) => ({ slug }));

/** Raw Markdown for a page: powers "View as Markdown" and lets LLM tools read the docs. */
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const p = getPage((await params).slug);
  if (!p) return new Response("Not found", { status: 404 });
  return new Response(fullMarkdown(p), { headers: { "content-type": "text/markdown; charset=utf-8" } });
}
