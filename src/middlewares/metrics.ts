import { MiddlewareHandler } from 'hono'
import promClient from 'prom-client'

const labels = ['status_code', 'method', 'path']

promClient.collectDefaultMetrics()

export const summary = new promClient.Summary({
  name: 'http_request_duration_seconds',
  help: 'duration summary of http responses labeled with: ' + labels.join(', '),
  percentiles: [0.5, 0.95, 0.99],
  maxAgeSeconds: 300,
  ageBuckets: 5,
  labelNames: labels,
})

export const metricsMiddleware = (): MiddlewareHandler => {
  return async (ctx, next) => {
    const { pathname } = new URL(ctx.req.url)

    if (
      pathname.includes('/healthz') ||
      pathname.includes('/favicon') ||
      pathname.includes('/metrics')
    ) {
      return await next()
    }

    const end = summary.startTimer({
      method: ctx.req.method,
      path: pathname,
    })

    await next()

    end({ status_code: ctx.res.status })
  }
}
