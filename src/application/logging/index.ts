import dayjs from 'dayjs'
import { pino } from 'pino'

const timestamp = () => {
  return dayjs().format('YYYY-MM-DDTHH:mm:ss.SSS')
}

export const logger = pino({
  enabled: process.env.NODE_ENV !== 'test',
  timestamp: () => `,"timestamp":"${timestamp()}"`,
  formatters: {
    level: (label) => {
      return { level: label }
    },
    bindings: () => {
      return {}
    },
  },
})
