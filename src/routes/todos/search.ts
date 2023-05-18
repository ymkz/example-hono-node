import { zValidator } from '@hono/zod-validator'
import { and, desc, eq, isNull } from 'drizzle-orm'
import { Hono } from 'hono'
import { z } from 'zod'
import { db } from '../../db'
import { Todo, todos } from '../../db/schemas/todos'
import { registry } from '../../utils/openapi'

const todosSearchQuery = z.object({
  title: z.string().min(1).optional(),
  status: z.enum(['progress', 'pending', 'done']).optional(),
})

export const todosSearchRoute = new Hono().get(
  '/',
  zValidator('query', todosSearchQuery),
  (ctx) => {
    const { title, status } = ctx.req.valid('query')

    const query = db.select().from(todos).orderBy(desc(todos.createdAt))

    // FIXME: 条件が多くなると分岐が増えて崩壊する。ただ適切な実装が不明。
    if (title && status) {
      query.where(
        and(
          eq(todos.title, title),
          eq(todos.status, status),
          isNull(todos.deletedAt)
        )
      )
    } else if (title) {
      query.where(and(eq(todos.title, title), isNull(todos.deletedAt)))
    } else if (status) {
      query.where(and(eq(todos.status, status), isNull(todos.deletedAt)))
    }

    const result = query.all()

    return ctx.json<Todo[]>(result)
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
          schema: z.object({}),
        },
      },
    },
  },
})
