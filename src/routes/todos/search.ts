import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'
import { db } from '../../database'
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

    let query = db
      .selectFrom('todos')
      .selectAll()
      .orderBy('todos.created_at', 'desc')
      .where('todos.deleted_at', 'is', null)

    if (title) {
      query = query.where('todos.title', 'like', `%${title}%`)
    }
    if (status) {
      query = query.where('todos.status', '=', status)
    }

    const result = await query.execute()

    return ctx.json(result)
  }
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
