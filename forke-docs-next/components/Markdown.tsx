import Link from "next/link";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { isValidElement, type ReactElement, type ReactNode } from "react";
import { slugify } from "@/lib/docs";
import Icon from "./Icon";
import CodeBlock from "./CodeBlock";
import Lifecycle from "./widgets/Lifecycle";
import Pipeline from "./widgets/Pipeline";
import Fees from "./widgets/Fees";
import Levels from "./widgets/Levels";
import ClaimTimer from "./widgets/ClaimTimer";

/** Use {{name}} on its own line in any content/*.md to embed one of these. */
const WIDGETS: Record<string, () => ReactNode> = {
  lifecycle: () => <Lifecycle />, pipeline: () => <Pipeline />, fees: () => <Fees />, levels: () => <Levels />, claimtimer: () => <ClaimTimer />,
};

function textOf(n: ReactNode): string {
  if (n == null || typeof n === "boolean") return "";
  if (typeof n === "string" || typeof n === "number") return String(n);
  if (Array.isArray(n)) return n.map(textOf).join("");
  if (isValidElement(n)) return textOf((n as ReactElement<{ children?: ReactNode }>).props.children);
  return "";
}

const heading = (Tag: "h2" | "h3", cls: string) =>
  function Heading({ children }: { children?: ReactNode }) {
    const id = slugify(textOf(children));
    return (
      <Tag id={id} className={`group ${cls}`}>
        {children}
        <a href={`#${id}`} aria-label="Link to section" className="ml-2 font-normal text-dim no-underline opacity-0 group-hover:opacity-100">#</a>
      </Tag>
    );
  };

const KIND = {
  note: { bar: "border-l-accent", icon: "info", color: "text-accent-text" },
  important: { bar: "border-l-red-500", icon: "alert", color: "text-red-500" },
  tip: { bar: "border-l-green-500", icon: "spark", color: "text-green-500" },
} as const;

const components: Components = {
  h2: heading("h2", "mt-11 text-[23px] font-semibold leading-tight tracking-tight"),
  h3: heading("h3", "mt-7 text-[17px] font-semibold"),
  p: ({ children }) => <p className="max-w-[68ch] text-body">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold text-fg">{children}</strong>,
  ul: ({ children }) => <ul className="grid list-disc gap-1.5 pl-[22px] marker:text-dim">{children}</ul>,
  ol: ({ children }) => <ol className="grid list-decimal gap-1.5 pl-[22px] marker:text-dim">{children}</ol>,
  li: ({ children }) => <li className="max-w-[68ch] text-body">{children}</li>,
  a: ({ href = "", children }) => {
    const cls = "text-accent-text underline decoration-accent/40 underline-offset-[3px] hover:decoration-current";
    if (href.startsWith("#")) return <Link href={`/docs/${href.slice(1)}`} className={cls}>{children}</Link>;
    return <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{children}</a>;
  },
  code: ({ children }) => <code className="rounded-md border border-line bg-raise px-1.5 py-px font-mono text-[13px]">{children}</code>,
  pre: ({ children }) => {
    const el = children as ReactElement<{ className?: string; children?: ReactNode }>;
    const lang = (el?.props?.className ?? "").replace("language-", "");
    return <CodeBlock lang={lang} code={textOf(el?.props?.children).replace(/\n$/, "")} />;
  },
  table: ({ children }) => <div className="overflow-auto rounded-xl border border-line"><table className="w-full border-collapse text-sm">{children}</table></div>,
  th: ({ children }) => <th className="whitespace-nowrap border-b border-line bg-panel px-3.5 py-2.5 text-left font-semibold">{children}</th>,
  td: ({ children }) => <td className="border-b border-line px-3.5 py-2.5 align-top [tr:last-child_&]:border-b-0">{children}</td>,
  blockquote: ({ children }) => {
    const t = textOf(children).trim();
    const k = KIND[/^Important/.test(t) ? "important" : /^Tip/.test(t) ? "tip" : "note"];
    return (
      <div className={`flex gap-3 rounded-[10px] border border-l-[3px] border-line bg-panel px-4 py-3.5 ${k.bar}`}>
        <Icon name={k.icon} className={`mt-1 size-4 ${k.color}`} />
        <div className="[&_p]:max-w-none [&_p]:text-fg">{children}</div>
      </div>
    );
  },
};

export default function Markdown({ body }: { body: string }) {
  const parts: { w?: string; md?: string }[] = [];
  let buf: string[] = [];
  body.split("\n").forEach((l) => {
    const m = l.match(/^\{\{(\w+)\}\}\s*$/);
    if (m) { if (buf.length) parts.push({ md: buf.join("\n") }); buf = []; parts.push({ w: m[1] }); } else buf.push(l);
  });
  if (buf.length) parts.push({ md: buf.join("\n") });
  return (
    <div className="mt-[30px] grid gap-4">
      {parts.map((p, i) => p.w ? <div key={i}>{WIDGETS[p.w]?.()}</div> : <div key={i} className="grid gap-4 [&>*:first-child]:mt-0"><ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>{p.md!}</ReactMarkdown></div>)}
    </div>
  );
}
