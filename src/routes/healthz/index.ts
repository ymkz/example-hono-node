import { Hono } from 'hono'

const healthzApp = new Hono()

export const healthzRoute = healthzApp.get('/', (ctx) => {
  return ctx.text('OK')
})
