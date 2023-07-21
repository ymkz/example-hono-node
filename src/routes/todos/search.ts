import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'
import { ZodOpenApiOperationObject } from 'zod-openapi'
import { todosQuery } from '~/repositories/query'
import { todosSchema } from '~/repositories/schema/todos'

const requestQuery = z.object({
  title: z.string().nonempty().optional(),
  status: z.enum(['progress', 'pending', 'done']).optional(),
})
const response200 = todosSchema

export const todosSearchRoute = new Hono().get(
  '/todos/search',
  zValidator('query', requestQuery),
  async (ctx) => {
    const { title, status } = ctx.req.valid('query')

    const result = await todosQuery.search({ title, status })

    return ctx.json(result)
  },
)

export const todosSearchOperation: ZodOpenApiOperationObject = {
  description: 'Todoの検索',
  requestParams: {
    query: requestQuery,
  },
  responses: {
    200: { content: { 'application/json': { schema: response200 } } },
    400: { content: { 'application/json': { schema: {} } } },
    500: { content: { 'application/json': { schema: {} } } },
  },
}
