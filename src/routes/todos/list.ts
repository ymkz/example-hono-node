import { zValidator } from '@hono/zod-validator'
import { and, desc, eq, isNull } from 'drizzle-orm'
import { Hono } from 'hono'
import { z } from 'zod'
import { db } from '../../db'
import { Todo, todos } from '../../db/schemas/todos'
import { registry } from '../../utils/openapi'

const todoListQuery = z.object({
  status: z.enum(['progress', 'pending', 'done']).default('progress'),
})

export const todosListRoute = new Hono().get(
  '/',
  zValidator('query', todoListQuery),
  (ctx) => {
    const { status } = ctx.req.valid('query')

    const result = db
      .select()
      .from(todos)
      .where(and(eq(todos.status, status), isNull(todos.deletedAt)))
      .orderBy(desc(todos.createdAt))
      .all()

    return ctx.json<Todo[]>(result)
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
          schema: z.object({}),
        },
      },
    },
  },
})
