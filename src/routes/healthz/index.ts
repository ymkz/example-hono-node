import { Hono } from 'hono'

export const healthzRoute = new Hono().get('/healthz', (ctx) => {
  return ctx.text('OK')
})
