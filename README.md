# Kyyinfinite: Free Public API Platform

Free APIs. Limitless Possibilities. Kyyinfinite gives developers, students, and curious builders free public APIs they can use right away. No API keys, sign-up, or billing. Just straightforward HTTP endpoints. JSON endpoints share one consistent response format, while binary endpoints stream files directly.

## Product principles

- Every public endpoint is callable without an API key.
- No registration, billing, credits, or subscriptions exist anywhere in the platform.
- Every JSON response uses the same envelope: `status`, `code`, `message`, `data`, `meta`; binary endpoints return raw file bytes with safe response headers.
- Users only see Kyyinfinite across responses, documentation, errors, and download links. External provider details stay behind the scenes.
- The catalog is dynamic: administrators enable, disable, and retune endpoints from the admin dashboard without a redeployment.

## Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 18, Vite 5, TypeScript (strict), Tailwind CSS 3, GSAP, React Router 6, TanStack Query 5 |
| Backend | TypeScript, Hono 4 (single catch-all Vercel Function), Zod validation, native fetch |
| Database | Supabase PostgreSQL (service-role access from the backend only, RLS enabled) |
| Auth | Supabase Auth (admin dashboard only; public API requires no credentials) |
| Caching | In-process TTL cache with single-flight + CDN `s-maxage`; Upstash Redis optional for shared rate limiting |
| Deployment | One Vercel project, one backend Function (`api/index.ts`) |

## Repository layout

```
api/
  index.ts                         Vercel entry point for the backend Function
backend/
  app.ts                     Hono assembly: middleware, admin routes, dispatcher
  config/env.ts              Zod-validated environment configuration
  core/                      dispatcher, registry, response envelope, errors,
                             request context, cache, rate limiting, param schemas
  database/
    client.ts                Supabase client + repository factory
    repositories/            types, Supabase implementation, in-memory fallback
    migrations/0001_init.sql Full schema, indexes, RLS, seed data
  providers/
    http/client.ts           SSRF-guarded HTTP client (allowlist, DNS checks,
                             redirects, timeouts, size caps)
    nexray/adapter.ts        First provider adapter with Zod response validation
    normalizers/             universal response normalizers
    registry.ts              provider adapter allowlist
  services/                  catalog, provider execution, status, analytics,
                             handlers, settings, usage, incidents
  admin/                     auth (Supabase token verification) + admin routes
  seed/definitions.ts        code-level endpoint allowlist (source of truth)
src/                         React frontend (unchanged design, backend-driven data)
tests/                       Vitest unit + integration + security suites (67 tests)
local/server.ts              local API server for development (`npm run dev:api`)
```

## Public API

All endpoints are free and keyless. Base URL is the deployment origin.

The migration adds 73 public endpoints from the former `kyyinfiniteweb` catalog: 71 provider-backed endpoints plus the two Alight Motion activation endpoints. Together with the 10 already-listed public endpoints in this project, the resulting public catalog contains 83 active listed endpoints. Categories include search, maker, downloader, tools, AI, news, information, primbon, random, stalker, and anime. JSON endpoints use the standard Kyyinfinite envelope; binary endpoints return their file bytes with the provider content type.

For an existing Supabase deployment, apply `backend/database/migrations/0002_migrate_legacy_api_registry.sql` after `0001_init.sql`. Local development uses the in-memory seed and does not require a database migration. The two Alight Motion endpoints additionally require the server-only `JAGOMOTION_API_KEY`; all other migrated endpoints route through the configured generic provider adapters for `api.nexray.eu.cc` and `api.siputzx.my.id`. See [MIGRATION_REPORT.md](./MIGRATION_REPORT.md) for the complete endpoint inventory and migration boundary.

| Endpoint | Method | Description |
| --- | --- | --- |
| `/api/v1/tools/info` | GET | Welcome envelope and integration smoke test |
| `/api/v1/tools/uuid?count=` | GET | Random v4 UUIDs (1–50) |
| `/api/v1/tools/base64` | POST | Base64 encode/decode |
| `/api/v1/tools/hash` | POST | SHA-1/SHA-256/SHA-512 digests |
| `/api/v1/tools/url-encode` | POST | Percent encode/decode |
| `/api/v1/info/time?tz=` | GET | World time for an IANA timezone |
| `/api/v1/info/ip` | GET | Caller IP echo |
| `/api/v1/youtube/search?q=` | GET | Media metadata lookup |
| `/api/v1/youtube/download?q=` | GET | Media details + relay reference |
| `/api/v1/youtube/download/relay?q=&id=` | GET | File stream through the platform (size-capped) |
| `/api/v1/categories` | GET | Active category catalog |
| `/api/v1/endpoints` | GET | Active endpoint catalog with docs metadata |
| `/api/v1/status` | GET | Public platform health |

Example:

```bash
curl "https://<your-deployment-domain>/api/v1/youtube/search?q=laufey"
```

```json
{
  "status": "success",
  "code": 200,
  "message": "Request completed successfully",
  "data": { "title": "Laufey: Tiny Desk Concert", "media": { "id": "avjI3_GIZBw" } },
  "meta": { "request_id": "req_…", "timestamp": "2026-11-11T09:00:00.000Z", "response_time_ms": 128, "api_version": "v1" }
}
```

Errors follow the same envelope with `status: "error"`, a typed `error` object, and truthful HTTP status codes. Provider identity never appears in any response, header, or error message.

## Abuse protection (no API key required by design)

- Per-IP rate limiting: global rolling window (default 120/min) plus per-endpoint limits, with `X-RateLimit-*` headers, `Retry-After` on 429, and an escalating temporary cooldown for sustained abuse.
- Request validation with strict Zod schemas (unknown parameters are rejected).
- Request body size cap (16 KB), provider response size caps, and request timeouts.
- SSRF protection for all outbound calls: HTTPS-only, allowlisted provider hosts, DNS resolution checked against private/reserved IP ranges, redirect validation, no user-supplied URLs are ever fetched.
- Security headers, CORS for browser clients, sanitized error envelopes, salted IP hashing in usage logs, retention purge via Vercel Cron.

## Frontend

- Homepage with live request console, category grid, benefits strip.
- API Explorer (`/apis`) driven by the live catalog: search, filter, counts.
- API Detail (`/apis/:category/:endpoint`) with parameters, schemas, examples, error codes.
- Playground (`/playground`) that executes real requests and shows status, timing, size, and copyable code snippets.
- Status (`/status`) rendering real telemetry from `/api/v1/status`.
- Admin dashboard (`/admin`) behind Supabase Auth: analytics, endpoint lifecycle, cache TTL, rate limits, providers, incidents, settings, cache flush.
- The frontend always talks to the real backend. There is no mock adapter or static catalog.

## Environment variables

Copy `.env.example` to `.env`. Never put secrets in `VITE_` variables.

| Variable | Used by | Required |
| --- | --- | --- |
| `VITE_API_BASE_URL` | frontend | No. Uses the same origin when empty |
| `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` | frontend | Required for the admin dashboard |
| `SUPABASE_ANON_KEY` | backend | Required for admin token verification (falls back to `VITE_SUPABASE_ANON_KEY`) |
| `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` | backend | Required in production (without them the API runs on the seeded in-memory catalog) |
| `ADMIN_EMAILS` | backend | Required to grant admin dashboard access |
| `ADMIN_CONFIGURATION_SECRET` | backend | Optional. Also authorizes the maintenance purge endpoint |
| `PROVIDER_NEXRAY_BASE_URL` | backend | Defaults to `https://api.nexray.eu.cc` |
| `PROVIDER_NEXRAY_SECRET` | backend | Only if the provider requires it |
| `JAGOMOTION_API_KEY` | backend | Required only for the two Alight Motion activation endpoints |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | backend | Optional. Enables shared rate limiting across instances |
| `DOWNLOAD_MAX_BYTES` | backend | Optional. Sets the relay size cap (25 MB by default) |
| `CRON_SECRET` | backend | Optional. Authorizes Vercel Cron for `/api/v1/maintenance/purge` |
| `CATALOG_STRICT` | backend | Optional. When `true`, startup requires Supabase |

## Setup

### 1. Install and run locally

```bash
npm install
npm run dev:api     # backend on http://localhost:8787 (in-memory catalog)
npm run dev         # frontend on http://localhost:5173 (proxies /api/ to 8787)
```

Without Supabase, the backend starts with a seeded in-memory catalog. Every route remains available, but data resets when the server restarts. Tests use the same setup: `npm test`.

### 2. Configure Supabase

1. Create a Supabase project.
2. Run the migration: SQL Editor → paste `backend/database/migrations/0001_init.sql` → execute. It creates all tables, indexes, RLS policies, and the seed catalog (categories, endpoints, the internal provider row, mappings, settings).
3. Copy the project URL and service-role key into `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY`, and the URL plus anon key into `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`.
4. Create an admin user (Supabase Dashboard → Authentication → Add user) and list their email in `ADMIN_EMAILS`.

### 3. Deploy to Vercel

1. Import the repository as a single Vercel project (framework: Vite).
2. Set the environment variables from the table above.
3. Deploy. The build runs `tsc` for both frontend and backend, builds `dist/`, and registers exactly one Function: `api/index.ts`.
4. Verify `GET /api/v1/tools/info` returns the success envelope on the deployment domain.
5. Optionally set `CRON_SECRET` so the daily cron can purge old usage logs.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Frontend dev server (live proxy to the local API) |
| `npm run dev:api` | Backend dev server with watch mode |
| `npm run build` | Type-checks both projects and builds the production bundle |
| `npm test` | Runs the 67-test Vitest suite |
| `npm run typecheck` | Type-checks frontend and backend only |

## Endpoint parameter examples

Every documented endpoint parameter now includes an editable `example` value. The API detail page displays those values in the parameter table and provides copy-ready cURL, JavaScript Fetch, and Python examples. Opening an endpoint in Playground pre-fills query and JSON body parameters from the same catalog metadata.

For an existing Supabase deployment, apply migrations in order if they have not been applied yet. If migration `0002_migrate_legacy_api_registry.sql` is already applied, run the new idempotent migration:

```text
backend/database/migrations/0003_endpoint_parameter_examples.sql
```

The sample values prefixed with `YOUR_` are placeholders and should be replaced before sending a request. Public endpoints remain free and do not require developer API keys.
