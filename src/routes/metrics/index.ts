import { Hono } from 'hono'
import promClient from 'prom-client'

const metricsApp = new Hono()

export const metricsRoute = metricsApp.get('/', async (ctx) => {
  const result = await promClient.register.metrics()
  return ctx.text(result)
})
