import { MiddlewareHandler } from 'hono'
import { randomUUID } from 'node:crypto'
import { context } from '../utils/logger/context'
import { pinoInstance } from '../utils/logger/instance'

/**
 * @see https://blog.logrocket.com/logging-with-pino-and-asynclocalstorage-in-node-js/
 */
export const requestIdMiddleware = (): MiddlewareHandler => {
  return async (ctx, next) => {
    const requestId = ctx.req.header('x-request-id') ?? randomUUID()

    const child = pinoInstance.child({ requestId })
    const store = new Map()

    store.set('logger', child)

    return context.run(store, next)
  }
}
