import { getRequestListener } from '@hono/node-server'
import { createApp } from '../backend/app'

const app = createApp()

export default getRequestListener(app.fetch)
