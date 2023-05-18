import { Hono } from 'hono'

export const healthzRoute = new Hono().get('/', (ctx) => {
  return ctx.text('OK')
})
