import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'
import { ZodOpenApiOperationObject } from 'zod-openapi'
import { todosQuery } from '../../repositories/query'

const todosSearchQuery = z.strictObject({
  title: z.string().min(1).optional(),
  status: z.enum(['progress', 'pending', 'done']).optional(),
})

export const todosSearchRoute = new Hono().get(
  '/todos/search',
  zValidator('query', todosSearchQuery),
  async (ctx) => {
    const { title, status } = ctx.req.valid('query')

    const result = await todosQuery.findOne(title, status)

    return ctx.json(result)
  },
)

export const todosSearchOperation: ZodOpenApiOperationObject = {
  description: 'Todoの検索',
  requestParams: {
    query: todosSearchQuery,
  },
  responses: {
    200: { content: { 'application/json': { schema: {} } } },
    400: { content: { 'application/json': { schema: {} } } },
    500: { content: { 'application/json': { schema: {} } } },
  },
}
