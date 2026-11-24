/**
 * @fileoverview Forke Platform
 * @copyright (c) 2026 Forke Inc. (https://www.forke.space/)
 *
 * Source-Available License (Non-Commercial / Fair Source).
 * This source code is open for inspection, learning, and personal development.
 * Commercial use, hosting, or resale as a paid service without an explicit
 * commercial license from Forke Inc. is strictly prohibited.
 */

import { ALL_ITEMS } from '@/lib/docs/nav'
import { markdownFor, searchDocs } from '@/lib/docs/agents'

/**
 * A read-only MCP server for these docs (JSON-RPC over Streamable HTTP, JSON responses, no sign-in).
 * Add https://www.forke.space/docs-demo/mcp to an AI app and it can search and read every page.
 */

const PROTOCOLS = ['2025-06-18', '2025-03-26', '2024-11-05']

const TOOLS = [
  {
    name: 'search_docs',
    title: 'Search the Forke docs',
    description: 'Search Forke and Forke Mail documentation: guides, the HTTP API reference, the CLI and the MCP server. Returns page paths to pass to read_page.',
    inputSchema: { type: 'object', properties: { query: { type: 'string', description: 'What to look for, such as "verify a domain" or "webhook signature"' } }, required: ['query'] },
    annotations: { readOnlyHint: true },
  },
  {
    name: 'read_page',
    title: 'Read a docs page',
    description: 'The full markdown of one docs page, with code samples. Use a path from search_docs or list_pages, such as "mail/quickstart" or "mail/api/emails/send".',
    inputSchema: { type: 'object', properties: { path: { type: 'string', description: 'The page path, without /docs-demo/' } }, required: ['path'] },
    annotations: { readOnlyHint: true },
  },
  {
    name: 'list_pages',
    title: 'List every docs page',
    description: 'Every page with its section, for browsing.',
    inputSchema: { type: 'object', properties: {} },
    annotations: { readOnlyHint: true },
  },
]

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Mcp-Protocol-Version, Mcp-Session-Id, Authorization',
}

type RpcRequest = { jsonrpc?: string; id?: string | number | null; method: string; params?: Record<string, unknown> }

const text = (t: string, isError = false) => ({ content: [{ type: 'text', text: t }], isError })

function call(name: string, args: Record<string, unknown>) {
  if (name === 'search_docs') {
    const query = String(args.query ?? '').trim()
    if (!query) return text('Give a query.', true)
    const hits = searchDocs(query)
    if (!hits.length) return text(`No pages match "${query}". Try fewer or more general words, or call list_pages.`)
    return text(hits.map((h) => `- ${h.title} (path: ${h.path})\n  ${h.section}. ${h.description}`).join('\n'))
  }
  if (name === 'read_page') {
    const path = String(args.path ?? '').replace(/^\/?docs-demo\/?/, '').replace(/^\/|\/$|\.md$/g, '')
    const md = markdownFor(path)
    return md ? text(md) : text(`No page at "${path}". Use search_docs or list_pages to find the right path.`, true)
  }
  if (name === 'list_pages') return text(ALL_ITEMS.map((i) => `- ${i.title} (path: ${i.path}) · ${i.group}`).join('\n'))
  return null
}

function handle(req: RpcRequest) {
  if (req.id === undefined || req.id === null) return null
  const base = { jsonrpc: '2.0', id: req.id }
  switch (req.method) {
    case 'initialize': {
      const asked = String(req.params?.protocolVersion ?? '')
      return {
        ...base,
        result: {
          protocolVersion: PROTOCOLS.includes(asked) ? asked : PROTOCOLS[0],
          capabilities: { tools: { listChanged: false } },
          serverInfo: { name: 'forke-docs', title: 'Forke Docs', version: '1.0.0' },
          instructions: 'Read-only search over the Forke and Forke Mail docs. Use search_docs, then read_page. To act on a Forke Mail account, the user should connect https://mail.forke.space/mcp instead.',
        },
      }
    }
    case 'ping':
      return { ...base, result: {} }
    case 'tools/list':
      return { ...base, result: { tools: TOOLS } }
    case 'tools/call': {
      const out = call(String(req.params?.name ?? ''), (req.params?.arguments as Record<string, unknown>) ?? {})
      return out ? { ...base, result: out } : { ...base, error: { code: -32602, message: `Unknown tool: ${req.params?.name}` } }
    }
    case 'resources/list':
      return { ...base, result: { resources: [] } }
    case 'prompts/list':
      return { ...base, result: { prompts: [] } }
    default:
      return { ...base, error: { code: -32601, message: `Method not found: ${req.method}` } }
  }
}

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error' } }, { status: 400, headers: CORS })
  }
  const out = Array.isArray(body) ? body.map((r) => handle(r as RpcRequest)).filter(Boolean) : handle(body as RpcRequest)
  if (out === null || (Array.isArray(out) && !out.length)) return new Response(null, { status: 202, headers: CORS })
  return Response.json(out, { headers: { ...CORS, 'Cache-Control': 'no-store' } })
}

export function GET() {
  return new Response(
    'Forke Docs MCP server. Add https://www.forke.space/docs-demo/mcp to your AI app as a remote MCP server (Streamable HTTP, no sign-in). Tools: search_docs, read_page, list_pages.\n',
    { status: 405, headers: { ...CORS, Allow: 'POST, OPTIONS', 'Content-Type': 'text/plain; charset=utf-8' } },
  )
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS })
}
