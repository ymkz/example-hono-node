import dayjs from 'dayjs'
import { LoggerOptions, pino } from 'pino'
import { env } from '../env'

const options: LoggerOptions = {
  timestamp: () => {
    return `,"timestamp":"${dayjs().format('YYYY-MM-DDTHH:mm:ss.SSS')}"`
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

export const logger =
  env.NODE_ENV === 'production'
    ? pino({ ...options })
    : pino({ ...options, transport: { target: 'pino-pretty' } })
