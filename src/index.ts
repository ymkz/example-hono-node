import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'
import { z } from 'zod'
import { accesslogMiddleware } from './middlewares/accesslog'
import { metricsMiddleware } from './middlewares/metrics'
import { requestIdMiddleware } from './middlewares/requestid'
import { healthzRoute } from './routes/healthz'
import { metricsRoute } from './routes/metrics'
import { todosRoute } from './routes/todos'
import { env } from './utils/env'
import { logger } from './utils/log'
import { writeOpenAPIDocument } from './utils/openapi'

extendZodWithOpenApi(z)

const app = new Hono()

app.use('*', requestIdMiddleware())
app.use('*', accesslogMiddleware())
app.use('*', metricsMiddleware())

app.route('/healthz', healthzRoute)
app.route('/metrics', metricsRoute)
app.route('/todos', todosRoute)

if (env.NODE_ENV !== 'production') {
  writeOpenAPIDocument()
  app.get('/docs/*', serveStatic())
}

serve(app, () => {
  logger.info(`build for ${env.NODE_ENV}`)
  logger.info(`app ready on http://localhost:3000`)
})
