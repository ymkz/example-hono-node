import { Counter } from 'prom-client'

export const errorCounter = new Counter({
  name: 'error_counter',
  help: 'counter of error by code',
  labelNames: ['code'],
})

export const warnCounter = new Counter({
  name: 'warn_counter',
  help: 'counter of warn by code',
  labelNames: ['code'],
})
