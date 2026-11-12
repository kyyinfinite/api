begin;

insert into public.api_endpoints (
  id, category_id, name, slug, public_path, method, description,
  normalizer_id, handler_id, kind, param_schema_id, request_schema,
  response_schema, docs, is_active, lifecycle, cache_ttl, rate_limit, sort_order
) values
(
  '7c0d8f21-8e83-4a2e-a0a1-1f8c0b5a1001',
  (select id from public.categories where slug = 'ai'),
  'DeepSearch', 'ai-deepsearch', '/api/v1/ai/deepsearch', 'GET',
  'Send a prompt to DeepSearch and return its response.',
  'legacy-default-v1', null, 'provider', 'legacy-query-ai-deepsearch',
  '[{"name":"text","type":"string","required":true,"description":"Prompt to send","location":"query","example":"YOUR_TEXT"}]'::jsonb,
  '[{"name":"data.result","type":"object | array | string","description":"Normalized response from the service."}]'::jsonb,
  '{"title":"DeepSearch","summary":"Send a prompt to DeepSearch and return its response.","description":"Send a prompt to DeepSearch and return its response. Provider responses are normalized into the Kyyinfinite response envelope.","params":[{"name":"text","type":"string","required":true,"description":"Prompt to send","location":"query","example":"YOUR_TEXT"}],"headers":[],"requestExample":null,"responseExample":{"status":"success","code":200,"message":"Request completed successfully","data":{"status":true,"result":"Provider response"}},"responseSchema":[{"name":"data.result","type":"object | array | string","description":"Normalized response from the service."}],"errorCodes":[{"code":400,"name":"INVALID_PARAMS","description":"One or more query parameters are missing or invalid."},{"code":429,"name":"RATE_LIMITED","description":"Too many requests in the current window."},{"code":502,"name":"UPSTREAM_ERROR","description":"The upstream service returned an invalid response."},{"code":504,"name":"UPSTREAM_TIMEOUT","description":"The upstream service took too long to respond."},{"code":500,"name":"INTERNAL_ERROR","description":"An unexpected platform error occurred."}]}'::jsonb,
  true, 'active', 0, '{"windowSeconds":60,"max":10}'::jsonb, 84
),
(
  '7c0d8f21-8e83-4a2e-a0a1-1f8c0b5a1002',
  (select id from public.categories where slug = 'ai'),
  'Gemini', 'ai-gemini', '/api/v1/ai/gemini', 'GET',
  'Send a prompt to Gemini and return its response.',
  'legacy-default-v1', null, 'provider', 'legacy-query-ai-gemini',
  '[{"name":"text","type":"string","required":true,"description":"Prompt to send","location":"query","example":"YOUR_TEXT"}]'::jsonb,
  '[{"name":"data.result","type":"object | array | string","description":"Normalized response from the service."}]'::jsonb,
  '{"title":"Gemini","summary":"Send a prompt to Gemini and return its response.","description":"Send a prompt to Gemini and return its response. Provider responses are normalized into the Kyyinfinite response envelope.","params":[{"name":"text","type":"string","required":true,"description":"Prompt to send","location":"query","example":"YOUR_TEXT"}],"headers":[],"requestExample":null,"responseExample":{"status":"success","code":200,"message":"Request completed successfully","data":{"status":true,"result":"Provider response"}},"responseSchema":[{"name":"data.result","type":"object | array | string","description":"Normalized response from the service."}],"errorCodes":[{"code":400,"name":"INVALID_PARAMS","description":"One or more query parameters are missing or invalid."},{"code":429,"name":"RATE_LIMITED","description":"Too many requests in the current window."},{"code":502,"name":"UPSTREAM_ERROR","description":"The upstream service returned an invalid response."},{"code":504,"name":"UPSTREAM_TIMEOUT","description":"The upstream service took too long to respond."},{"code":500,"name":"INTERNAL_ERROR","description":"An unexpected platform error occurred."}]}'::jsonb,
  true, 'active', 0, '{"windowSeconds":60,"max":10}'::jsonb, 85
)
on conflict (slug) do update set
  category_id = excluded.category_id, name = excluded.name,
  public_path = excluded.public_path, method = excluded.method,
  description = excluded.description, normalizer_id = excluded.normalizer_id,
  handler_id = excluded.handler_id, kind = excluded.kind,
  param_schema_id = excluded.param_schema_id, request_schema = excluded.request_schema,
  response_schema = excluded.response_schema, docs = excluded.docs,
  is_active = true, lifecycle = 'active', cache_ttl = excluded.cache_ttl,
  rate_limit = excluded.rate_limit, sort_order = excluded.sort_order;

insert into public.endpoint_provider_mappings (endpoint_id, provider_id, provider_path, priority, configuration, is_active)
values
  ((select id from public.api_endpoints where slug = 'ai-deepsearch'), (select id from public.providers where internal_name = 'legacy-nexray'), '/ai/deepsearch', 1, '{"paramsMap":{"text":"text"}}'::jsonb, true),
  ((select id from public.api_endpoints where slug = 'ai-gemini'), (select id from public.providers where internal_name = 'legacy-nexray'), '/ai/gemini', 1, '{"paramsMap":{"text":"text"}}'::jsonb, true)
on conflict (endpoint_id, provider_id) do update set
  provider_path = excluded.provider_path,
  configuration = excluded.configuration,
  is_active = true;

commit;
