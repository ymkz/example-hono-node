import { Hono } from 'hono'
import promClient from 'prom-client'

export const metricsRoute = new Hono().get('/', async (ctx) => {
  const result = await promClient.register.metrics()
  return ctx.text(result)
})
