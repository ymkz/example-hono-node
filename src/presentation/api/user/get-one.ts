import { RouteHandler, createRoute, z } from '@hono/zod-openapi'
import { logger } from '~/application/logging'
import { response400, response404, response500 } from '~/presentation/schema'

const response200 = z.object({
  name: z.string(),
})

export const getUserOneRoute = createRoute({
  method: 'get',
  path: '/users/:id',
  request: {
    params: z.object({
      id: z.string().min(1).max(3),
    }),
  },
  responses: {
    200: {
      description: '正常系',
      content: { 'application/json': { schema: response200 } },
    },
    400: {
      description: 'リクエスト異常',
      content: { 'application/json': { schema: response400 } },
    },
    404: {
      description: '存在しないユーザー',
      content: { 'application/json': { schema: response404 } },
    },
    500: {
      description: 'エラー',
      content: { 'application/json': { schema: response500 } },
    },
  },
})

export const getUserOneHandler: RouteHandler<typeof getUserOneRoute> = (
  ctx,
) => {
  const params = ctx.req.valid('param')
  logger.info({ params })
  return ctx.text('getUserOneHandler')
}
