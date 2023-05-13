import dayjs from 'dayjs'
import { LoggerOptions, pino } from 'pino'
import { context } from '../../middlewares/requestid'
import { env } from '../env'

const options: LoggerOptions = {
  timestamp: () => {
    return `,"time":"${dayjs().format('YYYY-MM-DDTHH:mm:ss.SSS')}"`
  },
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() }
    },
    bindings: () => {
      return {}
    },
  },
}

export const loggerInstance =
  env.NODE_ENV === 'production'
    ? pino({ ...options })
    : pino({ ...options, transport: { target: 'pino-pretty' } })

export const logger = new Proxy(loggerInstance, {
  get(target, property, receiver) {
    target = context.getStore()?.get('logger') || target
    return Reflect.get(target, property, receiver)
  },
})
