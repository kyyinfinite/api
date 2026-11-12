import type { ApiRequestConfig } from '../../services/api/api.types'

export interface SnippetOptions {
  binary?: boolean
}

export interface BinaryProbe {
  responseSchema: ReadonlyArray<{ name: string }>
  responseExample?: { status?: unknown } | null
}

export function isBinaryEndpoint(endpoint: BinaryProbe): boolean {
  if (endpoint.responseExample?.status === 'binary') return true
  return endpoint.responseSchema.some((field) => field.name === '(binary)')
}

function requestUrl(config: ApiRequestConfig, baseUrl: string): string {
  const search = new URLSearchParams(config.query ?? {})
  const query = search.toString()
  return `${baseUrl.replace(/\/$/, '')}${config.path}${query ? `?${query}` : ''}`
}

function shellQuote(value: string): string {
  return `'${value.replace(/'/g, `'\\''`)}'`
}

function resolveHeaders(config: ApiRequestConfig): Record<string, string> {
  const headers = { ...(config.headers ?? {}) }
  const hasContentType = Object.keys(headers).some((key) => key.toLowerCase() === 'content-type')
  if (config.body && !hasContentType) return { 'Content-Type': 'application/json', ...headers }
  return headers
}

export function buildCurl(
  config: ApiRequestConfig,
  baseUrl: string,
  options: SnippetOptions = {},
): string {
  const parts = [`curl -X ${config.method} ${shellQuote(requestUrl(config, baseUrl))}`]
  Object.entries(resolveHeaders(config)).forEach(([key, value]) => {
    parts.push(`  -H ${shellQuote(`${key}: ${value}`)}`)
  })
  if (config.body) {
    parts.push(`  --data-raw ${shellQuote(JSON.stringify(config.body))}`)
  }
  if (options.binary) {
    parts.push('  -o output.bin')
  }
  return parts.join(' \\\n')
}

export function buildFetch(
  config: ApiRequestConfig,
  baseUrl: string,
  options: SnippetOptions = {},
): string {
  const headers = resolveHeaders(config)
  const fetchOptions: string[] = [`method: '${config.method}'`]
  if (Object.keys(headers).length) {
    const formattedHeaders = JSON.stringify(headers, null, 2)
      .split('\n')
      .map((line, index) => (index === 0 ? line : `  ${line}`))
      .join('\n')
    fetchOptions.push(`headers: ${formattedHeaders}`)
  }
  if (config.body) fetchOptions.push(`body: JSON.stringify(${JSON.stringify(config.body, null, 2)})`)

  const call = `const response = await fetch(${JSON.stringify(requestUrl(config, baseUrl))}, {\n  ${fetchOptions.join(',\n  ')}\n})`

  if (options.binary) {
    return `${call}\n\nif (!response.ok) throw new Error(await response.text())\n\nconst blob = await response.blob()\nconsole.log(blob.type, blob.size)`
  }
  return `${call}\n\nconst data = await response.json()\nconsole.log(data)`
}

export function buildPython(
  config: ApiRequestConfig,
  baseUrl: string,
  options: SnippetOptions = {},
): string {
  const lines = config.body ? ['import json', 'import requests', ''] : ['import requests', '']
  const args = [JSON.stringify(requestUrl(config, baseUrl))]
  const headers = resolveHeaders(config)
  if (Object.keys(headers).length) args.push(`headers=${JSON.stringify(headers)}`)
  if (config.body) args.push(`json=json.loads(${JSON.stringify(JSON.stringify(config.body))})`)
  lines.push(`response = requests.${config.method.toLowerCase()}(${args.join(', ')})`, '')

  if (options.binary) {
    lines.push(
      'print(response.status_code)',
      'response.raise_for_status()',
      '',
      "with open('output.bin', 'wb') as file:",
      '    file.write(response.content)',
      '',
      "print(response.headers.get('content-type'), len(response.content))",
    )
    return lines.join('\n')
  }

  lines.push('print(response.status_code)', 'print(response.json())')
  return lines.join('\n')
}
