import { MiddlewareHandler } from 'hono'
import { logger } from '../utils/log'

const time = (start: number) => {
  const delta = performance.now() - start
  return Math.round(delta)
}

export const accesslogMiddleware = (): MiddlewareHandler => {
  return async (ctx, next) => {
    const { pathname } = new URL(ctx.req.url)

    if (
      pathname === '/' ||
      pathname.includes('/healthz') ||
      pathname.includes('/favicon') ||
      pathname.includes('/metrics')
    ) {
      return await next()
    }

    // TODO: remoteIpをだしたい
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
