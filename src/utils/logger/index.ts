import { context } from '~/utils/logger/context'
import { pinoInstance } from '~/utils/logger/instance'

export const logger = new Proxy(pinoInstance, {
  get(target, property, receiver) {
    target = context.getStore()?.get('logger') || target
    return Reflect.get(target, property, receiver)
  },
})
