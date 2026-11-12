create extension if not exists pgcrypto;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  icon text not null default 'information',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint categories_slug_format check (slug ~ '^[a-z0-9-]{2,40}$'),
  constraint categories_sort_order_range check (sort_order >= 0 and sort_order <= 1000)
);

create table if not exists public.providers (
  id uuid primary key default gen_random_uuid(),
  internal_name text not null unique,
  adapter_type text not null,
  base_url text not null,
  configuration jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint providers_internal_name_format check (internal_name ~ '^[a-z0-9-]{2,60}$'),
  constraint providers_base_url_https check (base_url like 'https://%')
);

create table if not exists public.api_endpoints (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete restrict,
  name text not null,
  slug text not null unique,
  public_path text not null,
  method text not null,
  description text not null default '',
  request_schema jsonb,
  response_schema jsonb,
  normalizer_id text,
  handler_id text,
  kind text not null default 'provider',
  param_schema_id text not null,
  docs jsonb,
  is_active boolean not null default false,
  lifecycle text not null default 'draft',
  cache_ttl integer not null default 0,
  rate_limit jsonb,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint api_endpoints_method check (method in ('GET', 'POST')),
  constraint api_endpoints_kind check (kind in ('provider', 'native', 'stream')),
  constraint api_endpoints_lifecycle check (lifecycle in ('draft', 'validated', 'active', 'disabled')),
  constraint api_endpoints_path_format check (public_path like '/api/v1/%'),
  constraint api_endpoints_path_no_traversal check (public_path not like '%..%'),
  constraint api_endpoints_cache_ttl check (cache_ttl >= 0 and cache_ttl <= 86400),
  constraint api_endpoints_slug_format check (slug ~ '^[a-z0-9-]{2,60}$'),
  constraint api_endpoints_provider_fields check (
    (kind = 'provider' and normalizer_id is not null) or
    (kind in ('native', 'stream') and handler_id is not null)
  ),
  constraint api_endpoints_path_method_unique unique (public_path, method)
);

create index if not exists api_endpoints_category_idx on public.api_endpoints (category_id);
create index if not exists api_endpoints_active_idx on public.api_endpoints (is_active) where is_active;
create index if not exists api_endpoints_path_idx on public.api_endpoints (public_path);

create table if not exists public.endpoint_provider_mappings (
  id uuid primary key default gen_random_uuid(),
  endpoint_id uuid not null references public.api_endpoints(id) on delete cascade,
  provider_id uuid not null references public.providers(id) on delete restrict,
  provider_path text not null,
  priority integer not null default 1,
  configuration jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint endpoint_provider_mappings_priority check (priority >= 1 and priority <= 100),
  constraint endpoint_provider_mappings_path_format check (provider_path like '/%'),
  constraint endpoint_provider_mappings_unique unique (endpoint_id, provider_id)
);

create index if not exists mappings_endpoint_idx on public.endpoint_provider_mappings (endpoint_id);

create table if not exists public.api_usage_logs (
  id bigint generated always as identity primary key,
  request_id text not null,
  endpoint_id uuid references public.api_endpoints(id) on delete set null,
  client_ip_hash text not null,
  status_code integer not null,
  duration_ms integer not null,
  cache_status text not null default 'MISS',
  created_at timestamptz not null default now(),
  constraint api_usage_logs_status_range check (status_code >= 100 and status_code <= 599),
  constraint api_usage_logs_duration check (duration_ms >= 0)
);

create index if not exists usage_logs_created_idx on public.api_usage_logs (created_at);
create index if not exists usage_logs_endpoint_created_idx on public.api_usage_logs (endpoint_id, created_at);
create index if not exists usage_logs_status_idx on public.api_usage_logs (status_code, created_at);

create table if not exists public.system_incidents (
  id uuid primary key default gen_random_uuid(),
  endpoint_id uuid references public.api_endpoints(id) on delete set null,
  incident_type text not null,
  message text not null,
  severity text not null default 'minor',
  status text not null default 'open',
  created_at timestamptz not null default now(),
  resolved_at timestamptz,
  constraint system_incidents_severity check (severity in ('minor', 'major', 'critical')),
  constraint system_incidents_status check (status in ('open', 'resolved')),
  constraint system_incidents_resolution_order check (resolved_at is null or resolved_at >= created_at)
);

create index if not exists incidents_status_idx on public.system_incidents (status, created_at);
create index if not exists incidents_type_idx on public.system_incidents (incident_type, created_at);

create table if not exists public.admin_settings (
  setting_key text primary key,
  setting_value jsonb not null,
  updated_at timestamptz not null default now(),
  constraint admin_settings_key_format check (setting_key ~ '^[a-z0-9_]{2,60}$')
);

alter table public.categories enable row level security;
alter table public.providers enable row level security;
alter table public.api_endpoints enable row level security;
alter table public.endpoint_provider_mappings enable row level security;
alter table public.api_usage_logs enable row level security;
alter table public.system_incidents enable row level security;
alter table public.admin_settings enable row level security;

drop policy if exists categories_public_read on public.categories;
create policy categories_public_read on public.categories
  for select to anon, authenticated
  using (is_active = true);

drop policy if exists endpoints_public_read on public.api_endpoints;
create policy endpoints_public_read on public.api_endpoints
  for select to anon, authenticated
  using (is_active = true);

insert into public.categories (id, name, slug, description, icon, sort_order, is_active) values
  ('a0000000-0000-4000-8000-000000000001', 'AI & Tools', 'ai', 'Text utilities, encoders, and developer tooling.', 'ai', 1, true),
  ('a0000000-0000-4000-8000-000000000002', 'Downloader', 'downloader', 'Media resolution and download helpers.', 'download', 2, true),
  ('a0000000-0000-4000-8000-000000000003', 'Search', 'search', 'Search utilities and more.', 'search', 3, true),
  ('a0000000-0000-4000-8000-000000000004', 'Image', 'image', 'Image processing and editing.', 'image', 4, true),
  ('a0000000-0000-4000-8000-000000000005', 'WhatsApp', 'whatsapp', 'WhatsApp utilities and more.', 'whatsapp', 5, true),
  ('a0000000-0000-4000-8000-000000000006', 'Information', 'information', 'General information and data.', 'information', 6, true),
  ('a0000000-0000-4000-8000-000000000007', 'Platform', 'platform', 'Internal platform metadata endpoints.', 'information', 7, false)
on conflict (slug) do nothing;

insert into public.api_endpoints (id, category_id, name, slug, public_path, method, description, normalizer_id, handler_id, kind, param_schema_id, is_active, lifecycle, cache_ttl, rate_limit, sort_order) values
  ('b0000000-0000-4000-8000-000000000021', 'a0000000-0000-4000-8000-000000000007', 'Categories', 'platform-categories', '/api/v1/categories', 'GET', 'Lists every active API category.', null, 'platform-categories', 'native', 'empty-query', true, 'active', 30, null, 0),
  ('b0000000-0000-4000-8000-000000000022', 'a0000000-0000-4000-8000-000000000007', 'Endpoint Catalog', 'platform-endpoints', '/api/v1/endpoints', 'GET', 'Lists every active endpoint with documentation metadata.', null, 'platform-endpoints', 'native', 'empty-query', true, 'active', 30, null, 0),
  ('b0000000-0000-4000-8000-000000000023', 'a0000000-0000-4000-8000-000000000007', 'Platform Status', 'platform-status', '/api/v1/status', 'GET', 'Public platform health and incidents.', null, 'platform-status', 'native', 'empty-query', true, 'active', 15, null, 0),
  ('b0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000001', 'Tools Info', 'tools-info', '/api/v1/tools/info', 'GET', 'Returns the canonical Kyyinfinite welcome envelope.', null, 'tools-info', 'native', 'empty-query', true, 'active', 300, null, 1),
  ('b0000000-0000-4000-8000-000000000002', 'a0000000-0000-4000-8000-000000000001', 'UUID Generator', 'tools-uuid', '/api/v1/tools/uuid', 'GET', 'Generates cryptographically random version 4 UUIDs.', null, 'tools-uuid', 'native', 'uuid-query', true, 'active', 0, '{"windowSeconds":60,"max":60}', 2),
  ('b0000000-0000-4000-8000-000000000003', 'a0000000-0000-4000-8000-000000000001', 'Base64 Encoder', 'tools-base64', '/api/v1/tools/base64', 'POST', 'Converts plain text to Base64 or decodes Base64 back to plain text.', null, 'tools-base64', 'native', 'base64-body', true, 'active', 0, '{"windowSeconds":60,"max":60}', 3),
  ('b0000000-0000-4000-8000-000000000004', 'a0000000-0000-4000-8000-000000000001', 'Hash Generator', 'tools-hash', '/api/v1/tools/hash', 'POST', 'Calculates the hexadecimal digest of the provided text.', null, 'tools-hash', 'native', 'hash-body', true, 'active', 0, '{"windowSeconds":60,"max":60}', 4),
  ('b0000000-0000-4000-8000-000000000005', 'a0000000-0000-4000-8000-000000000001', 'URL Encoder', 'tools-url-encode', '/api/v1/tools/url-encode', 'POST', 'Applies percent-encoding to text or decodes an encoded URL component.', null, 'tools-url-encode', 'native', 'url-encode-body', true, 'active', 0, '{"windowSeconds":60,"max":60}', 5),
  ('b0000000-0000-4000-8000-000000000006', 'a0000000-0000-4000-8000-000000000006', 'World Time', 'info-time', '/api/v1/info/time', 'GET', 'Returns the current date, time, and UTC offset for an IANA timezone.', null, 'info-time', 'native', 'time-query', true, 'active', 0, '{"windowSeconds":60,"max":120}', 6),
  ('b0000000-0000-4000-8000-000000000007', 'a0000000-0000-4000-8000-000000000006', 'IP Lookup', 'info-ip', '/api/v1/info/ip', 'GET', 'Returns the public IP address of the caller.', null, 'info-ip', 'native', 'ip-query', true, 'active', 0, '{"windowSeconds":60,"max":60}', 7),
  ('b0000000-0000-4000-8000-000000000008', 'a0000000-0000-4000-8000-000000000002', 'YouTube Search', 'youtube-search', '/api/v1/youtube/search', 'GET', 'Resolves a search term into structured media metadata.', 'youtube-search-v1', null, 'provider', 'youtube-search-query', true, 'active', 300, '{"windowSeconds":60,"max":30}', 8),
  ('b0000000-0000-4000-8000-000000000009', 'a0000000-0000-4000-8000-000000000002', 'YouTube Download', 'youtube-download', '/api/v1/youtube/download', 'GET', 'Resolves a search term into downloadable media details.', 'youtube-download-v1', null, 'provider', 'youtube-download-query', true, 'active', 300, '{"windowSeconds":60,"max":15}', 9),
  ('b0000000-0000-4000-8000-00000000000a', 'a0000000-0000-4000-8000-000000000002', 'Download Relay', 'youtube-download-relay', '/api/v1/youtube/download/relay', 'GET', 'Streams a resolved media file through the platform.', null, 'youtube-relay', 'stream', 'youtube-relay-query', true, 'active', 0, '{"windowSeconds":60,"max":10}', 10),
  ('b0000000-0000-4000-8000-000000000011', 'a0000000-0000-4000-8000-000000000001', 'AI Chat', 'ai-chat', '/api/v1/ai/chat', 'POST', 'Planned conversational completion endpoint, pending provider integration.', 'ai-chat-v1', null, 'provider', 'empty-query', false, 'draft', 0, '{"windowSeconds":60,"max":30}', 21),
  ('b0000000-0000-4000-8000-000000000012', 'a0000000-0000-4000-8000-000000000003', 'Web Search', 'search-web', '/api/v1/search/web', 'GET', 'Planned web search endpoint, pending provider integration.', 'web-search-v1', null, 'provider', 'empty-query', false, 'draft', 120, '{"windowSeconds":60,"max":30}', 22),
  ('b0000000-0000-4000-8000-000000000013', 'a0000000-0000-4000-8000-000000000004', 'Image Metadata', 'image-metadata', '/api/v1/image/metadata', 'GET', 'Planned image metadata endpoint, pending provider integration.', 'image-metadata-v1', null, 'provider', 'empty-query', false, 'draft', 300, '{"windowSeconds":60,"max":30}', 23),
  ('b0000000-0000-4000-8000-000000000014', 'a0000000-0000-4000-8000-000000000005', 'WhatsApp Status', 'whatsapp-status', '/api/v1/whatsapp/status', 'GET', 'Planned WhatsApp bridge status endpoint, pending provider integration.', 'whatsapp-status-v1', null, 'provider', 'empty-query', false, 'draft', 60, '{"windowSeconds":60,"max":30}', 24)
on conflict (slug) do nothing;

insert into public.providers (id, internal_name, adapter_type, base_url, configuration, is_active) values
  ('c0000000-0000-4000-8000-000000000001', 'nexray', 'nexray-http', 'https://api.nexray.eu.cc', '{"allowedHosts": ["api.nexray.eu.cc"], "timeoutMs": 20000, "maxResponseBytes": 2097152}', true)
on conflict (internal_name) do nothing;

insert into public.endpoint_provider_mappings (id, endpoint_id, provider_id, provider_path, priority, configuration, is_active) values
  ('d0000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000008', 'c0000000-0000-4000-8000-000000000001', '/downloader/ytplay', 1, '{"operation": "ytplay"}', true),
  ('d0000000-0000-4000-8000-000000000002', 'b0000000-0000-4000-8000-000000000009', 'c0000000-0000-4000-8000-000000000001', '/downloader/ytplay', 1, '{"operation": "ytplay"}', true)
on conflict (endpoint_id, provider_id) do nothing;

insert into public.admin_settings (setting_key, setting_value) values
  ('admin_emails', '[]'::jsonb),
  ('rate_limit_overrides', '{"global": null, "endpoints": {}}'::jsonb),
  ('download_limits', '{"maxBytes": 26214400}'::jsonb)
on conflict (setting_key) do nothing;
