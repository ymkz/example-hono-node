import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'
import { ZodOpenApiOperationObject } from 'zod-openapi'
import { todosQuery } from '~/repositories/query'
import { todosSchema } from '~/repositories/schema/todos'

const requestQuery = z.object({
  status: z.enum(['progress', 'pending', 'done']).default('progress'),
})
const response200 = todosSchema

export const todosListRoute = new Hono().get(
  '/todos',
  zValidator('query', requestQuery),
  async (ctx) => {
    const { status } = ctx.req.valid('query')

    const result = await todosQuery.findListByStatus(status)

    return ctx.json(result)
  },
)

export const todosListOperation: ZodOpenApiOperationObject = {
  description: 'Todoの一覧取得',
  requestParams: {
    query: requestQuery,
  },
  responses: {
    200: { content: { 'application/json': { schema: response200 } } },
    400: { content: { 'application/json': { schema: {} } } },
    500: { content: { 'application/json': { schema: {} } } },
  },
}
