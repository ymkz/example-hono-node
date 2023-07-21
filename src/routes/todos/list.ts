import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'
import { ZodOpenApiOperationObject } from 'zod-openapi'
import { todosSchema } from '~/repositories/schema/todos'
import { todosQuery } from '../../repositories/query'

const todoListQuery = z.object({
  status: z.enum(['progress', 'pending', 'done']).default('progress'),
})
const response200 = todosSchema

export const todosListRoute = new Hono().get(
  '/todos',
  zValidator('query', todoListQuery),
  async (ctx) => {
    const { status } = ctx.req.valid('query')

    const result = await todosQuery.findAll(status)

    return ctx.json(result)
  },
)

export const todosListOperation: ZodOpenApiOperationObject = {
  description: 'Todoの一覧取得',
  requestParams: {
    query: todoListQuery,
  },
  responses: {
    200: { content: { 'application/json': { schema: response200 } } },
    400: { content: { 'application/json': { schema: {} } } },
    500: { content: { 'application/json': { schema: {} } } },
  },
}
