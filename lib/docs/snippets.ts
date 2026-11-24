/**
 * @fileoverview Forke Platform
 * @copyright (c) 2026 Forke Inc. (https://www.forke.space/)
 *
 * Source-Available License (Non-Commercial / Fair Source).
 * This source code is open for inspection, learning, and personal development.
 * Commercial use, hosting, or resale as a paid service without an explicit
 * commercial license from Forke Inc. is strictly prohibited.
 */

/**
 * One request definition → idiomatic code in every language we document.
 * Every snippet uses the language's standard HTTP client (or its most common one), reads the key from
 * FORKE_MAIL_API_KEY and prints the JSON answer, so it can be pasted into a file and run as is.
 */

export const BASE_URL = 'https://mail.forke.space'

export type Json = string | number | boolean | null | Json[] | { [k: string]: Json }

export type Request = {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  path: string
  query?: Record<string, string>
  body?: { [k: string]: Json }
  /** multipart form fields (contacts import) */
  form?: Record<string, string>
  idempotencyKey?: string
}

export type LangId = 'curl' | 'node' | 'python' | 'php' | 'ruby' | 'go' | 'rust' | 'java' | 'dotnet'

export const API_LANGS: { id: LangId; name: string; shiki: string }[] = [
  { id: 'curl', name: 'cURL', shiki: 'bash' },
  { id: 'node', name: 'Node.js', shiki: 'ts' },
  { id: 'python', name: 'Python', shiki: 'python' },
  { id: 'php', name: 'PHP', shiki: 'php' },
  { id: 'ruby', name: 'Ruby', shiki: 'ruby' },
  { id: 'go', name: 'Go', shiki: 'go' },
  { id: 'rust', name: 'Rust', shiki: 'rust' },
  { id: 'java', name: 'Java', shiki: 'java' },
  { id: 'dotnet', name: '.NET', shiki: 'csharp' },
]

const pad = (n: number) => '  '.repeat(n)

function url(r: Request) {
  const q = r.query && Object.keys(r.query).length ? '?' + new URLSearchParams(r.query).toString() : ''
  return `${BASE_URL}${r.path}${q}`
}

const isObj = (v: Json): v is { [k: string]: Json } => typeof v === 'object' && v !== null && !Array.isArray(v)

/** Literal printers for languages that write the body natively. */
function literal(v: Json, d: number, s: { obj: [string, string]; kv: (k: string) => string; t: string; f: string; n: string; trail?: boolean }): string {
  if (v === null) return s.n
  if (v === true) return s.t
  if (v === false) return s.f
  if (typeof v === 'number') return String(v)
  if (typeof v === 'string') return JSON.stringify(v)
  const comma = s.trail ? ',' : ''
  if (Array.isArray(v)) {
    if (!v.length) return s.obj[0] === '{' ? '[]' : `${s.obj[0]}${s.obj[1]}`
    if (v.every((x) => !isObj(x) && !Array.isArray(x))) return `[${v.map((x) => literal(x, d, s)).join(', ')}]`
    return `[\n${v.map((x) => pad(d + 1) + literal(x, d + 1, s)).join(',\n')}${comma}\n${pad(d)}]`
  }
  const entries = Object.entries(v)
  if (!entries.length) return `${s.obj[0]}${s.obj[1]}`
  return `${s.obj[0]}\n${entries.map(([k, x]) => `${pad(d + 1)}${s.kv(k)}${literal(x, d + 1, s)}`).join(',\n')}${comma}\n${pad(d)}${s.obj[1]}`
}

const js = (v: Json, d = 0) => literal(v, d, { obj: ['{', '}'], kv: (k) => (/^[A-Za-z_$][\w$]*$/.test(k) ? k : JSON.stringify(k)) + ': ', t: 'true', f: 'false', n: 'null', trail: false })
const py = (v: Json, d = 0) => literal(v, d, { obj: ['{', '}'], kv: (k) => JSON.stringify(k) + ': ', t: 'True', f: 'False', n: 'None', trail: false })
const rb = (v: Json, d = 0) => literal(v, d, { obj: ['{', '}'], kv: (k) => (/^[a-z_]\w*$/.test(k) ? `${k}: ` : `${JSON.stringify(k)} => `), t: 'true', f: 'false', n: 'nil', trail: false })
function php(v: Json, d = 0): string {
  if (Array.isArray(v) || isObj(v)) {
    const entries = Array.isArray(v) ? v.map((x) => [null, x] as const) : Object.entries(v)
    if (!entries.length) return '[]'
    if (Array.isArray(v) && v.every((x) => !isObj(x) && !Array.isArray(x))) return `[${v.map((x) => php(x)).join(', ')}]`
    return `[\n${entries.map(([k, x]) => `${pad(d + 1)}${k === null ? '' : `'${k}' => `}${php(x, d + 1)}`).join(',\n')},\n${pad(d)}]`
  }
  if (v === null) return 'null'
  if (typeof v === 'string') return `'${v.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
  return String(v)
}
const jsonText = (v: Json, indentBy = 2) => JSON.stringify(v, null, indentBy)
const indent = (text: string, n: number) => text.split('\n').map((l, i) => (i === 0 ? l : pad(n) + l)).join('\n')

function curl(r: Request) {
  const lines = [`curl${r.method === 'GET' ? '' : ` -X ${r.method}`} "${url(r)}"`, `  -H "Authorization: Bearer $FORKE_MAIL_API_KEY"`]
  if (r.idempotencyKey) lines.push(`  -H "Idempotency-Key: ${r.idempotencyKey}"`)
  if (r.form) {
    for (const [k, v] of Object.entries(r.form)) lines.push(k === 'file' ? `  -F "file=@${v}"` : `  -F "${k}=${v}"`)
  } else if (r.body) {
    lines.push(`  -H "Content-Type: application/json"`)
    lines.push(`  -d '${jsonText(r.body).replace(/'/g, "'\\''").split('\n').join('\n  ')}'`)
  }
  return lines.join(' \\\n')
}

function node(r: Request) {
  const headers = [`Authorization: \`Bearer \${process.env.FORKE_MAIL_API_KEY}\`,`]
  if (r.body) headers.push(`'Content-Type': 'application/json',`)
  if (r.idempotencyKey) headers.push(`'Idempotency-Key': '${r.idempotencyKey}',`)
  const opts = [`method: '${r.method}',`, `headers: {\n    ${headers.join('\n    ')}\n  },`]
  let pre = ''
  if (r.form) {
    pre = `import { readFile } from 'node:fs/promises'\n\nconst form = new FormData()\n${Object.entries(r.form)
      .map(([k, v]) => (k === 'file' ? `form.append('file', new Blob([await readFile('${v}')]), '${v}')` : `form.append('${k}', '${v}')`))
      .join('\n')}\n\n`
    opts.push('body: form,')
  } else if (r.body) opts.push(`body: JSON.stringify(${indent(js(r.body), 1)}),`)
  return `${pre}const res = await fetch('${url(r)}', {\n  ${opts.join('\n  ')}\n})\n\nconst data = await res.json()\nif (!res.ok) throw new Error(\`Forke Mail: \${res.status} \${data.error}\`)\nconsole.log(data)`
}

function python(r: Request) {
  const h = [`"Authorization": f"Bearer {os.environ['FORKE_MAIL_API_KEY']}"`]
  if (r.idempotencyKey) h.push(`"Idempotency-Key": "${r.idempotencyKey}"`)
  const args = [`"${url(r)}"`, `headers={\n        ${h.join(',\n        ')},\n    }`]
  if (r.form) {
    const { file, ...rest } = r.form
    if (file) args.push(`files={"file": open("${file}", "rb")}`)
    if (Object.keys(rest).length) args.push(`data=${py(rest, 1)}`)
  } else if (r.body) args.push(`json=${py(r.body, 1)}`)
  return `import os\nimport requests\n\nres = requests.${r.method.toLowerCase()}(\n    ${args.join(',\n    ')},\n)\nres.raise_for_status()\nprint(res.json())`
}

function phpCode(r: Request) {
  const h = [`'Authorization: Bearer ' . getenv('FORKE_MAIL_API_KEY')`]
  let body = ''
  if (r.form) {
    body = `    CURLOPT_POSTFIELDS => [\n${Object.entries(r.form).map(([k, v]) => `        '${k}' => ${k === 'file' ? `new CURLFile('${v}')` : `'${v}'`},`).join('\n')}\n    ],\n`
  } else if (r.body) {
    h.push(`'Content-Type: application/json'`)
    body = `    CURLOPT_POSTFIELDS => json_encode(${indent(php(r.body, 0), 1)}),\n`
  }
  if (r.idempotencyKey) h.push(`'Idempotency-Key: ${r.idempotencyKey}'`)
  return `<?php\n\n$ch = curl_init('${url(r)}');\ncurl_setopt_array($ch, [\n    CURLOPT_CUSTOMREQUEST => '${r.method}',\n    CURLOPT_RETURNTRANSFER => true,\n    CURLOPT_HTTPHEADER => [\n        ${h.join(',\n        ')},\n    ],\n${body}]);\n\n$response = json_decode(curl_exec($ch), true);\n$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);\nif ($status >= 400) {\n    throw new Exception('Forke Mail: ' . $response['error']);\n}\nprint_r($response);`
}

function ruby(r: Request) {
  const cls = { GET: 'Get', POST: 'Post', PUT: 'Put', PATCH: 'Patch', DELETE: 'Delete' }[r.method]
  const lines = [`require "net/http"`, `require "json"`, ``, `uri = URI("${url(r)}")`, `req = Net::HTTP::${cls}.new(uri)`, `req["Authorization"] = "Bearer #{ENV.fetch("FORKE_MAIL_API_KEY")}"`]
  if (r.idempotencyKey) lines.push(`req["Idempotency-Key"] = "${r.idempotencyKey}"`)
  if (r.form) {
    lines.push(`req.set_form([${Object.entries(r.form).map(([k, v]) => (k === 'file' ? `["file", File.open("${v}")]` : `["${k}", "${v}"]`)).join(', ')}], "multipart/form-data")`)
  } else if (r.body) {
    lines.push(`req["Content-Type"] = "application/json"`, `req.body = ${rb(r.body)}.to_json`)
  }
  lines.push(``, `res = Net::HTTP.start(uri.host, uri.port, use_ssl: true) { |http| http.request(req) }`, `data = JSON.parse(res.body)`, `raise "Forke Mail: #{data["error"]}" unless res.is_a?(Net::HTTPSuccess)`, `puts data`)
  return lines.join('\n')
}

function go(r: Request) {
  const imports = ['"fmt"', '"io"', '"net/http"', '"os"']
  let body = 'nil'
  let pre = ''
  if (r.form) {
    imports.push('"bytes"', '"mime/multipart"')
    pre = `\tvar buf bytes.Buffer\n\tform := multipart.NewWriter(&buf)\n${Object.entries(r.form)
      .map(([k, v]) => (k === 'file' ? `\tpart, _ := form.CreateFormFile("file", "${v}")\n\tcsv, _ := os.ReadFile("${v}")\n\tpart.Write(csv)` : `\tform.WriteField("${k}", "${v}")`))
      .join('\n')}\n\tform.Close()\n\n`
    body = '&buf'
  } else if (r.body) {
    imports.push('"strings"')
    pre = `\tbody := strings.NewReader(\`${jsonText(r.body, 2).split('\n').join('\n\t')}\`)\n\n`
    body = 'body'
  }
  imports.sort()
  const headers = [`\treq.Header.Set("Authorization", "Bearer "+os.Getenv("FORKE_MAIL_API_KEY"))`]
  if (r.form) headers.push(`\treq.Header.Set("Content-Type", form.FormDataContentType())`)
  else if (r.body) headers.push(`\treq.Header.Set("Content-Type", "application/json")`)
  if (r.idempotencyKey) headers.push(`\treq.Header.Set("Idempotency-Key", "${r.idempotencyKey}")`)
  return `package main\n\nimport (\n\t${imports.join('\n\t')}\n)\n\nfunc main() {\n${pre}\treq, _ := http.NewRequest("${r.method}", "${url(r)}", ${body})\n${headers.join('\n')}\n\n\tres, err := http.DefaultClient.Do(req)\n\tif err != nil {\n\t\tpanic(err)\n\t}\n\tdefer res.Body.Close()\n\n\tdata, _ := io.ReadAll(res.Body)\n\tif res.StatusCode >= 400 {\n\t\tpanic(fmt.Sprintf("Forke Mail: %d %s", res.StatusCode, data))\n\t}\n\tfmt.Println(string(data))\n}`
}

function rust(r: Request) {
  const lines = [`// cargo add reqwest --features json,multipart`, `// cargo add tokio --features full`, `// cargo add serde_json`, `use serde_json::{json, Value};`, ``, `#[tokio::main]`, `async fn main() -> Result<(), Box<dyn std::error::Error>> {`, `    let key = std::env::var("FORKE_MAIL_API_KEY")?;`]
  if (r.form) {
    lines.push(`    let csv = std::fs::read("${r.form.file}")?;`, `    let form = reqwest::multipart::Form::new()`, `        .part("file", reqwest::multipart::Part::bytes(csv).file_name("${r.form.file}"))`)
    for (const [k, v] of Object.entries(r.form)) if (k !== 'file') lines.push(`        .text("${k}", "${v}")`)
    lines[lines.length - 1] += ';'
  }
  lines.push(``, `    let res = reqwest::Client::new()`, `        .${r.method.toLowerCase()}("${url(r)}")`, `        .bearer_auth(key)`)
  if (r.idempotencyKey) lines.push(`        .header("Idempotency-Key", "${r.idempotencyKey}")`)
  if (r.form) lines.push(`        .multipart(form)`)
  else if (r.body) lines.push(`        .json(&json!(${indent(jsonText(r.body, 4), 2)}))`)
  lines.push(`        .send()`, `        .await?;`, ``, `    let status = res.status();`, `    let data: Value = res.json().await?;`, `    if !status.is_success() {`, `        return Err(format!("Forke Mail: {} {}", status, data["error"]).into());`, `    }`, `    println!("{data:#}");`, `    Ok(())`, `}`)
  return lines.join('\n')
}

function java(r: Request) {
  let publisher = 'HttpRequest.BodyPublishers.noBody()'
  let pre = ''
  const headers = [`.header("Authorization", "Bearer " + System.getenv("FORKE_MAIL_API_KEY"))`]
  if (r.form) {
    const { file, ...rest } = r.form
    const parts = Object.entries(rest).map(([k, v]) => `            + "--" + boundary + "\\r\\nContent-Disposition: form-data; name=\\"${k}\\"\\r\\n\\r\\n${v}\\r\\n"`)
    pre = `        var boundary = "forke" + System.nanoTime();\n        var csv = java.nio.file.Files.readString(java.nio.file.Path.of("${file}"));\n        var body = ""\n${parts.join('\n')}${parts.length ? '\n' : ''}            + "--" + boundary + "\\r\\nContent-Disposition: form-data; name=\\"file\\"; filename=\\"${file}\\"\\r\\nContent-Type: text/csv\\r\\n\\r\\n"\n            + csv + "\\r\\n--" + boundary + "--\\r\\n";\n\n`
    publisher = 'HttpRequest.BodyPublishers.ofString(body)'
    headers.push(`.header("Content-Type", "multipart/form-data; boundary=" + boundary)`)
  } else if (r.body) {
    pre = `        var body = """\n            ${jsonText(r.body, 2).split('\n').join('\n            ')}\n            """;\n\n`
    publisher = 'HttpRequest.BodyPublishers.ofString(body)'
    headers.push(`.header("Content-Type", "application/json")`)
  }
  if (r.idempotencyKey) headers.push(`.header("Idempotency-Key", "${r.idempotencyKey}")`)
  return `import java.net.URI;\nimport java.net.http.HttpClient;\nimport java.net.http.HttpRequest;\nimport java.net.http.HttpResponse;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n${pre}        var request = HttpRequest.newBuilder(URI.create("${url(r)}"))\n            ${headers.join('\n            ')}\n            .method("${r.method}", ${publisher})\n            .build();\n\n        var response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());\n        if (response.statusCode() >= 400) {\n            throw new RuntimeException("Forke Mail: " + response.body());\n        }\n        System.out.println(response.body());\n    }\n}`
}

function dotnet(r: Request) {
  const lines = [`using System.Net.Http.Headers;`, `using System.Text;`, ``, `var http = new HttpClient();`, `http.DefaultRequestHeaders.Authorization =`, `    new AuthenticationHeaderValue("Bearer", Environment.GetEnvironmentVariable("FORKE_MAIL_API_KEY"));`]
  if (r.idempotencyKey) lines.push(`http.DefaultRequestHeaders.Add("Idempotency-Key", "${r.idempotencyKey}");`)
  lines.push(``, `var request = new HttpRequestMessage(HttpMethod.${r.method[0] + r.method.slice(1).toLowerCase()}, "${url(r)}");`)
  if (r.form) {
    lines.push(`var form = new MultipartFormDataContent();`)
    for (const [k, v] of Object.entries(r.form)) lines.push(k === 'file' ? `form.Add(new ByteArrayContent(File.ReadAllBytes("${v}")), "file", "${v}");` : `form.Add(new StringContent("${v}"), "${k}");`)
    lines.push(`request.Content = form;`)
  } else if (r.body) {
    lines.push(`request.Content = new StringContent("""`, `    ${jsonText(r.body, 2).split('\n').join('\n    ')}`, `    """, Encoding.UTF8, "application/json");`)
  }
  lines.push(``, `var response = await http.SendAsync(request);`, `var body = await response.Content.ReadAsStringAsync();`, `if (!response.IsSuccessStatusCode) throw new Exception($"Forke Mail: {body}");`, `Console.WriteLine(body);`)
  return lines.join('\n')
}

const GENERATORS: Record<LangId, (r: Request) => string> = { curl, node, python, php: phpCode, ruby, go, rust, java, dotnet }

export function snippet(lang: LangId, r: Request) {
  return GENERATORS[lang](r)
}

export function allSnippets(r: Request) {
  return API_LANGS.map((l) => ({ ...l, code: snippet(l.id, r) }))
}

export { js as jsLiteral, py as pyLiteral, php as phpLiteral, rb as rubyLiteral, jsonText }
