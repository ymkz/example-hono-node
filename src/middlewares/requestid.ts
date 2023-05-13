import { MiddlewareHandler } from 'hono'
import { nanoid } from 'nanoid'
import { AsyncLocalStorage } from 'node:async_hooks'
import { Logger } from 'pino'
import { loggerInstance } from '../utils/log'

export const context = new AsyncLocalStorage<Map<'logger', Logger>>()

export const requestIdMiddleware = (): MiddlewareHandler => {
  return async (ctx, next) => {
    const requestId = ctx.req.header('x-request-id') ?? nanoid()

    const child = loggerInstance.child({ requestId })
    const store = new Map()

    store.set('logger', child)

    return context.run(store, next)
  }
}
