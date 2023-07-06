import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'
import { todosQuery } from '../../database/query'
import { todos } from '../../database/schema/todos'
import { registry } from '../../utils/openapi'

const todosSearchQuery = z.strictObject({
  title: z.string().min(1).optional(),
  status: z.enum(['progress', 'pending', 'done']).optional(),
})

export const todosSearchRoute = new Hono().get(
  '/',
  zValidator('query', todosSearchQuery),
  async (ctx) => {
    const { title, status } = ctx.req.valid('query')

    const result = await todosQuery.findOne(title, status)

    return ctx.json(result)
  },
)

registry.registerPath({
  method: 'get',
  path: '/todos/search',
  summary: 'todoの検索',
  request: {
    query: todosSearchQuery,
  },
  responses: {
    200: {
      description: 'todoの検索成功',
      content: {
        'application/json': {
          schema: todos,
        },
      },
    },
  },
})
