# Forke Docs (Next.js + Tailwind CSS)

Next.js 16 (App Router, TypeScript) + Tailwind CSS v4. Fully static, frontend only.

## Run
```bash
npm install
npm run dev      # http://localhost:3000  (redirects to /docs)
npm run build && npm start
```

## Structure
```
content/*.md                 one file per doc page (frontmatter: title, description, read)
lib/docs.ts                  sidebar structure (NAV), content loader, search index
lib/search.ts                search + "Ask AI" answering (keyword based)
app/docs/layout.tsx          provider + shell (sidebar, palette, Ask AI, toasts, shortcuts)
app/docs/page.tsx            docs home
app/docs/[slug]/page.tsx     a doc page (static, generated from content/)
app/docs/md/[slug]/route.ts  raw Markdown ("View as Markdown", LLM-readable)
components/                  UI; components/widgets/ = interactive widgets
app/globals.css              theme tokens (colors) + Tailwind setup
```

## Editing content
- Edit or add `content/<slug>.md`, then list the slug in `NAV` inside `lib/docs.ts`.
- Embed a widget by putting `{{lifecycle}}`, `{{pipeline}}`, `{{fees}}`, `{{levels}}` or `{{claimtimer}}` on its own line.
- Internal links: `[text](#other-slug)`. Callouts: `> **Note** ...`, `> **Important** ...`, `> **Tip** ...`.

## Features
Docs home with animated terminal, interactive widgets, command palette (Ctrl/⌘ K or `/`), shortcuts (`A`, `[`, `]`, `T`, `?`),
docs rank (reading earns XP, stored in localStorage), page feedback, reading progress, Copy Markdown / Open in ChatGPT, Claude, Cursor,
light/dark/system theme, and an Ask AI chat that answers from the docs.

## Using a real LLM for Ask AI (optional)
Set `NEXT_PUBLIC_ASK_ENDPOINT=https://your-api/ask`. The modal POSTs `{ question, context: string[] }` and expects `{ answer: string }`.
Without it, answers come from keyword search over the docs (no backend needed).

## Adding to an existing Next.js app
Copy `app/docs`, `components`, `lib`, `content` into the app, merge `app/globals.css` (tokens + `@theme` blocks) into your Tailwind v4 CSS,
and install: `npm i react-markdown remark-gfm geist`. Keep the theme script from `app/layout.tsx` in your root layout.

## Content note
Titles and descriptions mirror forke.space/docs. Article bodies were drafted from those descriptions and the landing page,
so replace them with the official text in `content/*.md` before publishing.
