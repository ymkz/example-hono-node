import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { sql } from 'kysely'
import { z } from 'zod'
import { db } from '../../db'
import { registry } from '../../utils/openapi'

const todosDeletePathParam = z.object({
  id: z.coerce.number(),
})

export const todosDeleteRoute = new Hono().delete(
  '/',
  zValidator('param', todosDeletePathParam),
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
    params: todosDeletePathParam,
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
