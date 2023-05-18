import { zValidator } from '@hono/zod-validator'
import { eq, sql } from 'drizzle-orm'
import { Hono } from 'hono'
import { z } from 'zod'
import { db } from '../../db'
import { todos } from '../../db/schemas/todos'
import { registry } from '../../utils/openapi'

const todosDeleteParam = z.object({
  id: z
    .string()
    .refine((v) => !isNaN(Number(v)), 'Invalid string. Expected numeric')
    .transform((v) => Number(v)),
})

export const todosDeleteRoute = new Hono().delete(
  '/',
  zValidator('param', todosDeleteParam),
  (ctx) => {
    const { id } = ctx.req.valid('param')

    // 論理削除
    const result = db
      .update(todos)
      .set({ deletedAt: sql`DATETIME('now', 'localtime')` })
      .where(eq(todos.id, id))
      .returning()
      .get()

    if (!result) {
      return ctx.body(null, 404)
    }

    return ctx.body(null, 200)
  }
)

registry.registerPath({
  method: 'delete',
  path: '/todos/{id}',
  summary: 'todoの削除',
  request: {
    params: todosDeleteParam,
  },
  responses: {
    200: {
      description: 'todoの削除成功',
    },
    404: {
      description: '対象のtodoが存在しない',
    },
  },
})
