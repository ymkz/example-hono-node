import { context } from './context'
import { pinoInstance } from './instance'

export const logger = new Proxy(pinoInstance, {
  get(target, property, receiver) {
    target = context.getStore()?.get('logger') || target
    return Reflect.get(target, property, receiver)
  },
})
