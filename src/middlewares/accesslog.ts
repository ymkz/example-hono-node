import { MiddlewareHandler } from 'hono'
import { logger } from '../utils/log'

const time = (start: number) => {
  const delta = performance.now() - start
  return delta
}

export const accesslogMiddleware = (): MiddlewareHandler => {
  return async (ctx, next) => {
    const { pathname } = new URL(ctx.req.url)

    if (
      pathname.includes('/healthz') ||
      pathname.includes('/favicon') ||
      pathname.includes('/metrics') ||
      pathname.includes('/docs')
    ) {
      return await next()
    }

    logger.info({
      msg: 'request incoming',
      method: ctx.req.method,
      url: ctx.req.url,
    })

    const start = performance.now()

    await next()

    logger.info({
      msg: 'response completed',
      status: ctx.res.status,
      responseTimeMs: time(start),
    })
  }
}
