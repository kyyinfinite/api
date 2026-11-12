import { describe, expect, it } from 'vitest'
import { buildCurl, buildFetch, buildPython, isBinaryEndpoint } from '../../src/components/api/CodeExamples'
import type { ApiRequestConfig } from '../../src/services/api/api.types'
import { legacyEndpointDefinitions } from '../../backend/seed/legacy-api-definitions'

describe('copy-ready API examples', () => {
  it('provides an example value for every migrated endpoint parameter', () => {
    const params = legacyEndpointDefinitions.flatMap((endpoint) => endpoint.docs.params)
    expect(params.length).toBe(84)
    expect(params.every((param) => param.example !== undefined)).toBe(true)
  })

  it('includes default query parameters in cURL and JavaScript snippets', () => {
    const config: ApiRequestConfig = {
      method: 'GET',
      path: '/api/v1/search/spotify',
      query: { q: 'YOUR_SEARCH_QUERY' },
    }

    expect(buildCurl(config, 'https://api.example.com')).toContain(
      'https://api.example.com/api/v1/search/spotify?q=YOUR_SEARCH_QUERY',
    )
    expect(buildFetch(config, 'https://api.example.com')).toContain('YOUR_SEARCH_QUERY')
  })

  it('includes JSON body and content type for POST snippets', () => {
    const config: ApiRequestConfig = {
      method: 'POST',
      path: '/api/v1/am/send',
      body: { email: 'YOUR_EMAIL_ADDRESS' },
    }

    expect(buildCurl(config, 'https://api.example.com')).toContain("-H 'Content-Type: application/json'")
    expect(buildCurl(config, 'https://api.example.com')).toContain('YOUR_EMAIL_ADDRESS')
    expect(buildFetch(config, 'https://api.example.com')).toContain('JSON.stringify')
    expect(buildPython(config, 'https://api.example.com')).toContain('json.loads')
  })

  it('adds Content-Type to cURL when a body is present and no header is set', () => {
    const config: ApiRequestConfig = { method: 'POST', path: '/x', body: { a: 1 } }
    expect(buildCurl(config, 'https://api.example.com')).toContain("-H 'Content-Type: application/json'")
  })

  it('does not duplicate an existing Content-Type header', () => {
    const config: ApiRequestConfig = {
      method: 'POST',
      path: '/x',
      headers: { 'content-type': 'application/json' },
      body: { a: 1 },
    }
    const curl = buildCurl(config, 'https://api.example.com')
    expect(curl.match(/Content-Type/gi)?.length).toBe(1)
  })

  it('omits the json import in Python when there is no body', () => {
    const config: ApiRequestConfig = { method: 'GET', path: '/x', query: { q: 'a' } }
    expect(buildPython(config, 'https://api.example.com')).not.toContain('import json')
  })

  it('builds file-saving snippets for binary endpoints', () => {
    const config: ApiRequestConfig = { method: 'GET', path: '/api/v1/maker/brat', query: { text: 'hi' } }
    const base = 'https://api.example.com'
    expect(buildCurl(config, base, { binary: true })).toContain('-o output.bin')
    expect(buildFetch(config, base, { binary: true })).toContain('response.blob()')
    expect(buildFetch(config, base, { binary: true })).not.toContain('response.json()')
    expect(buildPython(config, base, { binary: true })).toContain('response.content')
    expect(buildPython(config, base, { binary: true })).not.toContain('response.json()')
  })

  it('keeps JSON snippets for non-binary endpoints', () => {
    const config: ApiRequestConfig = { method: 'GET', path: '/x' }
    expect(buildFetch(config, 'https://api.example.com')).toContain('response.json()')
    expect(buildPython(config, 'https://api.example.com')).toContain('response.json()')
  })

  it('detects binary endpoints from the registry docs', () => {
    const binary = legacyEndpointDefinitions.filter((endpoint) =>
      isBinaryEndpoint({
        responseSchema: endpoint.docs.responseSchema,
        responseExample: endpoint.docs.responseExample,
      }),
    )
    expect(binary.length).toBeGreaterThan(0)
    expect(binary.every((endpoint) => endpoint.kind === 'stream')).toBe(true)
  })
})
