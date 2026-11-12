update public.api_endpoints
set
  name = replace(name, ' ' || chr(8212) || ' ', ': '),
  docs = case
    when docs ? 'title' then jsonb_set(docs, '{title}', to_jsonb(replace(docs->>'title', ' ' || chr(8212) || ' ', ': ')))
    else docs
  end
where position(chr(8212) in name) > 0
   or position(chr(8212) in coalesce(docs->>'title', '')) > 0;
