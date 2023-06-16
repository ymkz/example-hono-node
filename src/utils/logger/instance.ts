import dayjs from 'dayjs'
import { LoggerOptions, pino } from 'pino'
import { config } from '../../config'

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

export const pinoInstance =
  config.NODE_ENV === 'production'
    ? pino({ ...options })
    : pino({ ...options, transport: { target: 'pino-pretty' } })
