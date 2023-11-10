import { OpenAPIHono } from '@hono/zod-openapi'
import {
  getUserListHandler,
  getUserListRoute,
} from '~/presentation/api/user/get-list'
import {
  getUserOneHandler,
  getUserOneRoute,
} from '~/presentation/api/user/get-one'
import {
  errorHandler,
  notFoundHandler,
  validationHook,
} from '~/presentation/hook'

const app = new OpenAPIHono({ defaultHook: validationHook })

app.notFound(notFoundHandler)
app.onError(errorHandler)

app.openapi(getUserListRoute, getUserListHandler)
app.openapi(getUserOneRoute, getUserOneHandler)

app.get('/healthz', (ctx) => ctx.text('OK'))

export { app }
