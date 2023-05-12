import dayjs from 'dayjs'
import { LoggerOptions, pino } from 'pino'

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

export const logger = pino({ ...options })
