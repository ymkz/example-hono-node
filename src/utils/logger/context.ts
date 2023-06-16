import { AsyncLocalStorage } from 'node:async_hooks'
import { Logger } from 'pino'

export const context = new AsyncLocalStorage<Map<'logger', Logger>>()
