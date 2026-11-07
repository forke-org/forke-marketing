import type { IndexEntry } from "./docs";

const STOP = "a an the is are do does did how what when why where can i my me to of in on for and or it be with at by from this that your you about".split(" ");
const stem = (w: string) => w.replace(/(ing|ed|es|s)$/, "");

export function rank(index: IndexEntry[], q: string, limit: number) {
  const ts = q.toLowerCase().replace(/[^\w₹\s-]/g, " ").split(/\s+/).filter((w) => w && !STOP.includes(w)).map(stem);
  if (!ts.length) return [];
  return index
    .map((e) => {
      const h = (e.heading + " " + e.title).toLowerCase(), b = e.text.toLowerCase();
      let s = 0;
      ts.forEach((t) => { if (h.includes(t)) s += 4; if (b.includes(t)) s += 1 + Math.min(2, (b.split(t).length - 1) * 0.3); });
      return { e, s };
    })
    .filter((x) => x.s > 0).sort((a, b) => b.s - a.s).slice(0, limit);
}

const firstParas = (text: string, max: number) => {
  const t = text.replace(/\s+/g, " ").trim();
  return t.length > max ? t.slice(0, max).replace(/\s\S*$/, "") + "…" : t;
};

export type Answer = { none?: boolean; paras: string[]; srcs: Pick<IndexEntry, "slug" | "anchor" | "title" | "heading">[] };

export function answer(index: IndexEntry[], q: string, current?: { slug: string; title: string; description: string; sections: string[] }): Answer {
  if (/^summari[sz]e (this|the) page/i.test(q) && current) {
    return {
      paras: [current.description, current.sections.length ? `It covers: ${current.sections.join(", ")}.` : ""].filter(Boolean),
      srcs: [{ slug: current.slug, anchor: "", title: current.title, heading: "" }],
    };
  }
  const hits = rank(index, q, 6);
  if (!hits.length || hits[0].s < 2) return { none: true, paras: [], srcs: [] };
  const best = hits[0].e, paras = [firstParas(best.text, 420)];
  if (hits[1] && hits[1].s >= hits[0].s * 0.75 && hits[1].e.text !== best.text) paras.push(firstParas(hits[1].e.text, 240));
  const seen = new Set<string>(), srcs: Answer["srcs"] = [];
  hits.forEach((h) => { const k = h.e.slug + h.e.anchor; if (!seen.has(k) && srcs.length < 3) { seen.add(k); srcs.push(h.e); } });
  return { paras, srcs };
}
