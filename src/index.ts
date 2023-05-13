import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { accesslogMiddleware } from './middlewares/accesslog'
import { metricsMiddleware } from './middlewares/metrics'
import { requestIdMiddleware } from './middlewares/requestid'
import { healthzRoute } from './routes/healthz'
import { metricsRoute } from './routes/metrics'
import { todosRoute } from './routes/todos'
import { env } from './utils/env'
import { logger } from './utils/log'

const app = new Hono()

app.use('*', requestIdMiddleware())
app.use('*', accesslogMiddleware())
app.use('*', metricsMiddleware())

app.route('/healthz', healthzRoute)
app.route('/metrics', metricsRoute)
app.route('/todos', todosRoute)

serve(app, () => {
  logger.info(`build for ${env.NODE_ENV}`)
  logger.info(`app ready on http://localhost:3000`)
})
