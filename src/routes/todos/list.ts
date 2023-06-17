import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'
import { findAll } from '../../database/query/todos'
import { todos } from '../../database/schema/todos'
import { registry } from '../../utils/openapi'

const todoListQuery = z.strictObject({
  status: z.enum(['progress', 'pending', 'done']).default('progress'),
})

export const todosListRoute = new Hono().get(
  '/',
  zValidator('query', todoListQuery),
  async (ctx) => {
    const { status } = ctx.req.valid('query')

    const result = await findAll(status)

    return ctx.json(result)
  }
)

registry.registerPath({
  method: 'get',
  path: '/todos',
  summary: 'todoの一覧取得',
  request: {
    query: todoListQuery,
  },
  responses: {
    200: {
      description: 'todoの一覧取得成功',
      content: {
        'application/json': {
          schema: todos,
        },
      },
    },
  },
})
