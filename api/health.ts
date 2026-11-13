interface HealthResponse {
  status(code: number): { json(body: unknown): void }
}

export default function handler(_request: unknown, response: HealthResponse): void {
  response.status(200).json({ ok: true, runtime: 'vercel-function' })
}
