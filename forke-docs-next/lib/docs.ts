import fs from "node:fs";
import path from "node:path";

export type Page = { slug: string; group: string; title: string; description: string; read: number; body: string };
export type PageMeta = Omit<Page, "body">;
export type Group = { group: string; icon: string; pages: string[] };
export type IndexEntry = { slug: string; anchor: string; heading: string; title: string; text: string };

/** Sidebar structure. Add/reorder pages here; content lives in /content/<slug>.md */
export const NAV: Group[] = [
  { group: "Getting started", icon: "rocket", pages: ["welcome", "core-concepts", "for-developers", "for-founders"] },
  { group: "Your account", icon: "user", pages: ["profile", "github-connection", "account-settings"] },
  { group: "Bounties & workflow", icon: "branch", pages: ["browsing-the-feed", "claiming-a-task", "branch-workflow", "submitting-a-pr"] },
  { group: "Review & quality", icon: "check", pages: ["review-pipeline", "verdict-card", "acceptance-criteria"] },
  { group: "Levels, XP & trust", icon: "trophy", pages: ["xp-system", "levels-and-unlocks", "skill-tracks", "trust-score"] },
  { group: "Payments & escrow", icon: "wallet", pages: ["escrow-system", "refunds-and-disputes"] },
  { group: "Policies & support", icon: "shield", pages: ["platform-policies", "getting-support"] },
];
export const ORDER = NAV.flatMap((g) => g.pages);

export const slugify = (s: string) => s.toLowerCase().replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-");

let cache: Record<string, Page> | null = null;
function load(): Record<string, Page> {
  if (cache && process.env.NODE_ENV === "production") return cache;
  const out: Record<string, Page> = {};
  for (const g of NAV) {
    for (const slug of g.pages) {
      const raw = fs.readFileSync(path.join(process.cwd(), "content", `${slug}.md`), "utf8");
      const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
      if (!m) throw new Error(`content/${slug}.md is missing frontmatter`);
      const meta: Record<string, string> = {};
      m[1].split("\n").forEach((l) => { const i = l.indexOf(":"); meta[l.slice(0, i).trim()] = l.slice(i + 1).trim(); });
      out[slug] = { slug, group: g.group, title: meta.title, description: meta.description, read: Number(meta.read) || 3, body: m[2].trim() };
    }
  }
  return (cache = out);
}

export const getPage = (slug: string): Page | undefined => load()[slug];
export const getAllMeta = (): Record<string, PageMeta> =>
  Object.fromEntries(Object.entries(load()).map(([k, { body: _b, ...meta }]) => [k, meta]));
export const fullMarkdown = (p: Page) => `# ${p.title}\n\n${p.description}\n\n${p.body}\n`;

export function headings(md: string) {
  return md.split("\n").flatMap((l) => {
    const m = l.match(/^(##|###) (.+)/);
    return m ? [{ id: slugify(m[2]), text: m[2], level: m[1].length }] : [];
  });
}

const clean = (t: string) =>
  t.replace(/^\{\{\w+\}\}\s*$/gm, "").replace(/^\|[\s\-|:]+\|\s*$/gm, "")
    .replace(/^\|(.+)\|\s*$/gm, (_, r: string) => r.split("|").map((c) => c.trim()).join(" – ") + ".")
    .replace(/```[\s\S]*?```/g, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/[*`>#]/g, "").trim();

/** Search / Ask-AI index, built once at build time and sent to the client. */
export function buildIndex(): IndexEntry[] {
  const out: IndexEntry[] = [];
  for (const p of Object.values(load())) {
    out.push({ slug: p.slug, anchor: "", heading: "", title: p.title, text: p.description });
    p.body.split(/\n(?=##+ )/).forEach((sec) => {
      const m = sec.match(/^##+ (.+)/);
      out.push({ slug: p.slug, anchor: m ? slugify(m[1]) : "", heading: m ? m[1] : "", title: p.title, text: clean(sec.replace(/^##+ .+\n?/, "")) });
    });
  }
  return out;
}
