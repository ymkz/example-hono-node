import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { sql } from 'kysely'
import { z } from 'zod'
import { db } from '../../db'
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
  async (ctx) => {
    const { id } = ctx.req.valid('param')

    // 物理削除ではなく論理削除する
    const result = await db
      .updateTable('todos')
      .set({ deleted_at: sql`DATETIME('now', 'localtime')` })
      .where('todos.id', '=', id)
      .returningAll()
      .executeTakeFirst()

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
