import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { z } from 'zod'
import '~/utils/env'
import { accesslogMiddleware } from './middlewares/accesslog'
import { metricsMiddleware } from './middlewares/metrics'
import { requestIdMiddleware } from './middlewares/requestid'
import { docsRoute } from './routes/docs'
import { healthzRoute } from './routes/healthz'
import { metricsRoute } from './routes/metrics'
import { todosRoute } from './routes/todos'
import { logger } from './utils/logger'
import { writeOpenAPIDocument } from './utils/openapi'

extendZodWithOpenApi(z)

const app = new Hono()

app.use('*', requestIdMiddleware())
app.use('*', accesslogMiddleware())
app.use('*', metricsMiddleware())

app.route('/healthz', healthzRoute)
app.route('/metrics', metricsRoute)
app.route('/todos', todosRoute)

if (process.env.NODE_ENV !== 'production') {
  writeOpenAPIDocument()
  app.route('/hono-nodejs', docsRoute)
}

serve(app, () => {
  logger.info(`running as ${process.env.NODE_ENV}`)
  logger.info(`ready on http://localhost:3000`)
})
