import { serve } from '@hono/node-server'
import { createApp } from '../backend/app'

const app = createApp()
const port = Number(process.env.API_PORT ?? 8787)

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`kyyinfinite api listening on http://localhost:${info.port}`)
})
