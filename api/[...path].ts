import { handle } from 'hono/vercel'
import { createApp } from '../backend/app'

const app = createApp()

export default handle(app)
