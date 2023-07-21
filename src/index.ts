import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { z } from 'zod'
import { extendZodWithOpenApi } from 'zod-openapi'
import { accesslogMiddleware } from '~/middlewares/accesslog'
import { metricsMiddleware } from '~/middlewares/metrics'
import { requestIdMiddleware } from '~/middlewares/requestid'
import { docsRoute } from '~/routes/docs'
import { healthzRoute } from '~/routes/healthz'
import { metricsRoute } from '~/routes/metrics'
import { todosCreateRoute } from '~/routes/todos/create'
import { todosDeleteRoute } from '~/routes/todos/delete'
import { todosIdRoute } from '~/routes/todos/id'
import { todosListRoute } from '~/routes/todos/list'
import { todosSearchRoute } from '~/routes/todos/search'
import { todosUpdateRoute } from '~/routes/todos/update'
import '~/utils/env'
import { logger } from '~/utils/logger'
import { writeOpenAPIDocument } from '~/utils/openapi'

extendZodWithOpenApi(z)

const app = new Hono()

app.use('*', requestIdMiddleware())
app.use('*', accesslogMiddleware())
app.use('*', metricsMiddleware())

app.route('/', healthzRoute)
app.route('/', metricsRoute)
app.route('/', todosListRoute)
app.route('/', todosCreateRoute)
app.route('/', todosIdRoute)
app.route('/', todosUpdateRoute)
app.route('/', todosDeleteRoute)
app.route('/', todosSearchRoute)

if (process.env.NODE_ENV !== 'production') {
  writeOpenAPIDocument()
  app.route('/', docsRoute)
}

serve(app, () => {
  logger.info(`ready on http://localhost:3000`)
  logger.info(`running as ${process.env.NODE_ENV}`)
})
