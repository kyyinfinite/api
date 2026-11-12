import { useEffect, useMemo, useState } from 'react'
import { TLink } from '@/components/motion/PageTransition'
import { Search, Menu, X, BookOpen } from 'lucide-react'
import { CopyButton } from '@/components/api/ResponseViewer'
import { EndpointBadge } from '@/components/api/EndpointBadge'
import { cn } from '@/utils/cn'

interface DocSection {
  id: string
  title: string
  blocks: DocBlock[]
}

type DocBlock =
  | { kind: 'p'; text: string }
  | { kind: 'code'; language: string; code: string }
  | { kind: 'list'; items: string[] }
  | { kind: 'table'; head: string[]; rows: string[][] }

const sections: DocSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    blocks: [
      {
        kind: 'p',
        text: 'Kyyinfinite is a free API ecosystem for developers. Every endpoint is free to call and documented in the explorer with a live playground. JSON responses use a consistent envelope; binary endpoints return raw files. This guide covers everything you need to integrate: request format, response format, error handling, and rate limits.',
      },
      {
        kind: 'list',
        items: [
          'No API keys are required for public endpoints.',
          'All responses share one envelope shape.',
          'Every endpoint has a playground preset.',
        ],
      },
    ],
  },
  {
    id: 'getting-started',
    title: 'Getting Started',
    blocks: [
      {
        kind: 'p',
        text: 'Pick an endpoint from the API Explorer, then call it with any HTTP client. The fastest way to verify your integration is the tools info endpoint, which always returns the platform welcome envelope.',
      },
      {
        kind: 'code',
        language: 'bash',
        code: `curl -X GET "https://<your-deployment-domain>/api/v1/tools/info"`,
      },
      {
        kind: 'code',
        language: 'json',
        code: `{
  "status": "success",
  "code": 200,
  "message": "Request completed successfully",
  "data": {
    "message": "Welcome to Kyyinfinite",
    "service": "kyyinfinite",
    "apiVersion": "v1",
    "free": true
  },
  "meta": {
    "request_id": "req_9f2c1a7e84b04d63",
    "timestamp": "2026-11-11T09:00:00.000Z",
    "response_time_ms": 34,
    "api_version": "v1"
  }
}`,
      },
      { kind: 'p', text: 'The base URL is the domain where Kyyinfinite is hosted. It is the same domain serving this documentation. Once your client receives the welcome response, it is ready to call the other endpoints.' },
    ],
  },
  {
    id: 'api-overview',
    title: 'API Overview',
    blocks: [
      {
        kind: 'p',
        text: 'The platform organizes endpoints into categories, and the catalog itself is dynamic: administrators can enable or disable endpoints without a redeployment. The API Explorer always shows the live catalog, and every endpoint page documents its parameters, headers, response schema, and error codes.',
      },
      {
        kind: 'table',
        head: ['Category', 'Base path', 'Focus'],
        rows: [
          ['AI & Tools', '/api/v1/ai · /api/v1/am', 'AI model endpoints and Alight Motion activation'],
          ['Downloader', '/api/v1/downloader · /api/v1/youtube', 'Media download and resolution endpoints'],
          ['Search', '/api/v1/search', 'Apple Music, Spotify, TikTok, and YouTube search'],
          ['Maker', '/api/v1/maker', 'Image, meme, quote, and video generation'],
          ['Tools', '/api/v1/tools', 'Translation, text-to-speech, image, and lookup utilities'],
          ['News', '/api/v1/news', 'News feeds from Indonesian publishers'],
          ['Information', '/api/v1/info', 'World time, caller IP, weather, BMKG, and TV schedule'],
          ['Primbon', '/api/v1/primbon', 'Name, dream, and traditional readings'],
          ['Random', '/api/v1/random', 'Random anime and Blue Archive media'],
          ['Stalker', '/api/v1/stalker', 'Public social and gaming profile lookup'],
          ['Anime', '/api/v1/anime', 'Anichin feeds, schedules, and genres'],
          ['Image', '/api/v1/image', 'Reserved for image metadata services'],
          ['WhatsApp', '/api/v1/whatsapp', 'Reserved for WhatsApp bridge services'],
        ],
      },
      {
        kind: 'list',
        items: [
          'GET /api/v1/categories lists every active category as JSON.',
          'GET /api/v1/endpoints lists every active endpoint with full documentation metadata.',
          'GET /api/v1/status exposes public platform health without internal details.',
        ],
      },
    ],
  },
  {
    id: 'request-format',
    title: 'Request Format',
    blocks: [
      {
        kind: 'p',
        text: 'All endpoints accept standard HTTP requests. Query parameters use short lowercase names, JSON bodies must have the application/json content type, and unknown parameters are rejected to catch typos early.',
      },
      {
        kind: 'code',
        language: 'javascript',
        code: `const res = await fetch('/api/v1/tools/uuid?count=5', {
  method: 'GET',
  headers: { 'Accept': 'application/json' },
})

const data = await res.json()`,
      },
      {
        kind: 'list',
        items: [
          'Query parameters: short lowercase names, sent in the URL.',
          'JSON bodies: UTF-8 encoded with Content-Type: application/json.',
          'Headers: Accept is optional and defaults to application/json.',
        ],
      },
    ],
  },
  {
    id: 'response-format',
    title: 'Response Format',
    blocks: [
      {
        kind: 'p',
        text: 'Every JSON response uses the same envelope: a status field, an HTTP-equivalent code, a human-readable message, the data payload, and a meta block with the request id, timestamp, measured response time, and API version. Binary endpoints return raw file bytes with their content type. Successful JSON calls return HTTP 200 with status success.',
      },
      {
        kind: 'code',
        language: 'json',
        code: `{
  "status": "success",
  "code": 200,
  "message": "Request completed successfully",
  "data": {
    "query": "laufey",
    "media": { "id": "avjI3_GIZBw", "type": "video" },
    "title": "Laufey: Tiny Desk Concert"
  },
  "meta": {
    "request_id": "req_9f2c1a7e84b04d63",
    "timestamp": "2026-11-11T09:00:00.000Z",
    "response_time_ms": 128,
    "api_version": "v1"
  }
}`,
      },
    ],
  },
  {
    id: 'error-handling',
    title: 'Error Handling',
    blocks: [
      {
        kind: 'p',
        text: 'Failures mirror the success envelope: status becomes error, the code field carries the HTTP-equivalent code, and an error object explains what went wrong. Client errors (4xx) mean the request was malformed; server errors (5xx) mean the platform failed and is worth retrying.',
      },
      {
        kind: 'table',
        head: ['Code', 'Name', 'Meaning'],
        rows: [
          ['400', 'BAD_REQUEST', 'The request body is malformed.'],
          ['400', 'INVALID_PARAMS', 'A required parameter is missing or invalid.'],
          ['404', 'NOT_FOUND', 'The endpoint or resource does not exist.'],
          ['405', 'METHOD_NOT_ALLOWED', 'The HTTP method is not supported on this path.'],
          ['413', 'PAYLOAD_TOO_LARGE', 'The request body exceeds the size limit.'],
          ['429', 'RATE_LIMITED', 'Too many requests in the current window.'],
          ['500', 'INTERNAL_ERROR', 'The platform encountered an unexpected error. Retry with backoff.'],
          ['502', 'UPSTREAM_ERROR', 'The service backing this endpoint returned an invalid response.'],
          ['504', 'UPSTREAM_TIMEOUT', 'The service backing this endpoint took too long.'],
        ],
      },
      {
        kind: 'code',
        language: 'json',
        code: `{
  "status": "error",
  "code": 429,
  "message": "Too many requests. Please slow down.",
  "data": null,
  "error": {
    "type": "RATE_LIMITED",
    "details": "Retry after 27 seconds."
  },
  "meta": {
    "request_id": "req_9f2c1a7e84b04d63",
    "timestamp": "2026-11-11T09:00:00.000Z",
    "response_time_ms": 12,
    "api_version": "v1"
  }
}`,
      },
      { kind: 'p', text: 'Error responses never expose internal infrastructure, third-party service details, or stack traces. Every response includes an X-Request-Id header for support conversations.' },
    ],
  },
  {
    id: 'rate-limits',
    title: 'Rate Limits',
    blocks: [
      {
        kind: 'p',
        text: 'Free endpoints are rate limited per client IP to keep the platform fast for everyone. A global rolling window applies to all endpoints together, and heavier endpoints may carry their own lower limit, which is documented on the endpoint page. Every response includes X-RateLimit-Limit and X-RateLimit-Remaining headers.',
      },
      {
        kind: 'list',
        items: [
          'Global window: 120 requests per rolling minute by default.',
          'Endpoint windows: heavier endpoints may allow fewer requests per minute.',
          'Exceeded: HTTP 429 with a Retry-After header.',
          'Sustained abuse triggers a temporary cooldown for the client IP.',
        ],
      },
    ],
  },
  {
    id: 'examples',
    title: 'Examples',
    blocks: [
      {
        kind: 'p',
        text: 'The playground generates ready-to-run snippets for JavaScript, cURL, and Python. Open any endpoint page and press Try this API to load its preset.',
      },
      {
        kind: 'code',
        language: 'python',
        code: `import requests

res = requests.get('/api/v1/info/time', params={'tz': 'Asia/Jakarta'}, headers={'Accept': 'application/json'})
print(res.json())`,
      },
      { kind: 'p', text: 'The playground executes real requests against the live platform, so every response you see is exactly what your own code will receive.' },
    ],
  },
]

function CodeBlock({ language, code }: { language: string; code: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-navy-border bg-navy">
      <div className="flex items-center justify-between border-b border-navy-border px-4 py-2">
        <span className="font-mono text-[11px] uppercase tracking-wideCaps text-[#6c7390]">
          {language}
        </span>
        <CopyButton value={code} onDark />
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[12.5px] leading-relaxed text-[#c8cfe4]">
        {code}
      </pre>
    </div>
  )
}

function DocBlockView({ block }: { block: DocBlock }) {
  if (block.kind === 'p')
    return <p className="font-body text-[15px] leading-[1.7] text-ink-soft">{block.text}</p>
  if (block.kind === 'code') return <CodeBlock language={block.language} code={block.code} />
  if (block.kind === 'list')
    return (
      <ul className="flex flex-col gap-2">
        {block.items.map((item) => (
          <li key={item} className="flex items-start gap-2.5 font-body text-[14px] leading-relaxed text-ink-soft">
            <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-cobalt" />
            {item}
          </li>
        ))}
      </ul>
    )
  return (
    <div className="w-full max-w-full overflow-x-auto rounded-xl border border-line bg-paper-raised">
      <table className="w-full min-w-[520px] text-left">
        <thead>
          <tr className="border-b border-line-muted">
            {block.head.map((h) => (
              <th
                key={h}
                className="px-4 py-3 font-body text-[11px] font-bold uppercase tracking-wideCaps text-ink-soft"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.rows.map((row, i) => (
            <tr key={i} className="border-b border-line-muted last:border-0">
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={cn(
                    'px-4 py-3 font-body text-[13px]',
                    j === 0 ? 'font-mono text-xs font-semibold text-cobalt' : 'text-ink-soft',
                  )}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function DocumentationPage() {
  const [query, setQuery] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [activeId, setActiveId] = useState(sections[0].id)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return sections
    return sections.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.blocks.some((b) => b.kind === 'p' && b.text.toLowerCase().includes(q)),
    )
  }, [query])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        })
      },
      { rootMargin: '-20% 0px -70% 0px' },
    )
    sections.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const sidebar = (
    <nav className="flex flex-col gap-0.5" aria-label="Documentation sections">
      {sections.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          onClick={() => setDrawerOpen(false)}
          className={cn(
            'rounded-lg px-3 py-2 font-body text-sm transition-colors',
            activeId === s.id
              ? 'bg-navy text-white'
              : 'text-ink-soft hover:bg-paper-soft hover:text-ink',
          )}
        >
          {s.title}
        </a>
      ))}
    </nav>
  )

  return (
    <div className="shell py-10 md:py-14">
      <div className="mb-8">
        <p data-enter className="eyebrow">DOCUMENTATION</p>
        <h1 data-enter className="mt-3 font-display text-[36px] font-bold leading-[1.08] text-ink md:text-[44px]">
          Read the docs. Ship faster.
        </h1>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-10 lg:grid-cols-[240px_1fr]">
        <div className="hidden lg:block">
          <div className="sticky top-28 flex flex-col gap-5">
            <div className="flex h-11 items-center gap-2.5 rounded-[10px] border border-line bg-paper-raised px-3.5 focus-within:border-cobalt">
              <Search size={16} className="shrink-0 text-ink-soft" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search documentation"
                className="h-full w-full bg-transparent font-body text-sm text-ink placeholder:text-ink-soft focus:outline-none"
                aria-label="Search documentation"
              />
            </div>
            {sidebar}
          </div>
        </div>

        <div className="min-w-0">
          <div className="mb-6 grid min-w-0 grid-cols-[auto_1fr] items-center gap-3 lg:hidden">
            <button
              onClick={() => setDrawerOpen((v) => !v)}
              className="inline-flex h-11 items-center gap-2 rounded-[10px] border border-line bg-paper-raised px-4 font-body text-sm font-semibold text-ink"
              aria-expanded={drawerOpen}
            >
              {drawerOpen ? <X size={16} /> : <Menu size={16} />} Sections
            </button>
            <div className="flex h-11 min-w-0 flex-1 items-center gap-2.5 rounded-[10px] border border-line bg-paper-raised px-3.5">
              <Search size={16} className="shrink-0 text-ink-soft" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search docs"
                className="h-full w-full bg-transparent font-body text-sm text-ink placeholder:text-ink-soft focus:outline-none"
                aria-label="Search documentation"
              />
            </div>
          </div>

          {drawerOpen && (
            <div className="mb-6 rounded-xl border border-line bg-paper-raised p-3 lg:hidden">
              {sidebar}
            </div>
          )}

          <div className="flex min-w-0 flex-col gap-14">
            {filtered.map((s) => (
              <section key={s.id} id={s.id} className="scroll-mt-28">
                <h2 className="flex items-center gap-3 font-display text-2xl font-bold text-ink">
                  <BookOpen size={20} className="text-cobalt" />
                  {s.title}
                </h2>
                <div className="mt-5 flex flex-col gap-4">
                  {s.blocks.map((b, i) => (
                    <DocBlockView key={i} block={b} />
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-14 rounded-2xl border border-line bg-paper-raised p-6 md:p-8">
            <h2 className="font-display text-xl font-bold text-ink">Try everything in the playground</h2>
            <p className="mt-2 max-w-lg font-body text-sm leading-relaxed text-ink-soft">
              Every documented endpoint has a preset. Load one and fire a simulated request in
              seconds.
            </p>
            <TLink to="/playground" className="btn-primary mt-5 h-12 px-6 text-sm">
              Open Playground
            </TLink>
          </div>
        </div>
      </div>

      <div className="pointer-events-none fixed bottom-6 right-6 hidden items-center gap-2 rounded-full border border-line bg-paper-raised px-4 py-2 shadow-dropdown xl:flex">
        <EndpointBadge method="GET" />
        <code className="font-mono text-xs text-ink">/api/v1/docs</code>
      </div>
    </div>
  )
}
