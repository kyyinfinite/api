import { z } from 'zod'
import { legacyEndpointDefinitions } from '../seed/legacy-api-definitions'

const encodedText = z.string().max(100_000)

const timeQuery = z
  .object({
    tz: z
      .string()
      .trim()
      .max(64)
      .optional()
      .default('UTC'),
  })
  .strict()

const ipQuery = z.object({}).strict()

const uuidQuery = z
  .object({
    count: z.coerce
      .number()
      .int()
      .min(1)
      .max(50)
      .optional()
      .default(1),
  })
  .strict()

const base64Body = z
  .object({
    action: z.enum(['encode', 'decode']),
    text: encodedText,
  })
  .strict()

const hashBody = z
  .object({
    algorithm: z.enum(['sha1', 'sha256', 'sha512']),
    text: encodedText,
  })
  .strict()

const urlEncodeBody = z
  .object({
    action: z.enum(['encode', 'decode']),
    text: encodedText,
  })
  .strict()

const youtubeSearchQuery = z
  .object({
    q: z.string().trim().min(1).max(180),
  })
  .strict()

const youtubeDownloadQuery = z
  .object({
    q: z.string().trim().min(1).max(180),
  })
  .strict()

const youtubeRelayQuery = z
  .object({
    q: z.string().trim().min(1).max(180),
    id: z.string().trim().regex(/^[A-Za-z0-9_-]{6,24}$/),
  })
  .strict()

export interface ParamSchema {
  query?: z.ZodTypeAny
  body?: z.ZodTypeAny
}

export const paramSchemas: Record<string, ParamSchema> = {
  'time-query': { query: timeQuery },
  'ip-query': { query: ipQuery },
  'uuid-query': { query: uuidQuery },
  'base64-body': { body: base64Body },
  'hash-body': { body: hashBody },
  'url-encode-body': { body: urlEncodeBody },
  'youtube-search-query': { query: youtubeSearchQuery },
  'youtube-download-query': { query: youtubeDownloadQuery },
  'youtube-relay-query': { query: youtubeRelayQuery },
  'empty-query': { query: z.object({}).strict() },
}

for (const definition of legacyEndpointDefinitions) {
  const shape: Record<string, z.ZodTypeAny> = {}
  for (const param of definition.docs.params.filter((entry) => entry.location === 'query')) {
    const value = z.string().trim().min(1).max(2_000)
    shape[param.name] = param.required ? value : value.optional()
  }
  paramSchemas[definition.paramSchemaId] = { query: z.object(shape).strict() }
}

paramSchemas['alight-motion-send-body'] = {
  query: z.object({}).strict(),
  body: z.object({ email: z.string().trim().email().max(254) }).strict(),
}
paramSchemas['alight-motion-verify-body'] = {
  query: z.object({}).strict(),
  body: z.object({ email: z.string().trim().email().max(254), link: z.string().trim().url().max(2_048) }).strict(),
}

export function getParamSchema(id: string): ParamSchema | null {
  return paramSchemas[id] ?? null
}

export function formatZodIssues(error: z.ZodError): string {
  return error.issues
    .map((issue) => `${issue.path.join('.') || 'value'}: ${issue.message}`)
    .join('; ')
}
