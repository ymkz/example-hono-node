import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { sql } from 'kysely'
import { z } from 'zod'
import { db } from '../../db'
import { registry } from '../../utils/openapi'

const todosUpdateParam = z.object({
  id: z
    .string()
    .refine((v) => !isNaN(Number(v)), 'Invalid string. Expected numeric')
    .transform((v) => Number(v)),
})

const todosUpdateBody = z.object({
  title: z.string().min(1).optional(),
  status: z.enum(['progress', 'pending', 'done']).optional(),
})

export const todosUpdateRoute = new Hono().patch(
  '/',
  zValidator('param', todosUpdateParam),
  zValidator('json', todosUpdateBody),
  async (ctx) => {
    const { id } = ctx.req.valid('param')
    const { title, status } = ctx.req.valid('json')

    // 明示的にupdated_atを更新する（TRIGGERによるON_UPDATEではなくアプリケーション側が責務を持つ）
    const result = await db
      .updateTable('todos')
      .set({ title, status, updated_at: sql`DATETIME('now', 'localtime')` })
      .where('todos.id', '=', id)
      .where('todos.deleted_at', 'is', null)
      .returningAll()
      .executeTakeFirst() // idを条件指定しているため必ずひとつだけ更新されているはず

    if (!result) {
      return ctx.body(null, 404)
    }

    return ctx.json(result)
  }
)

registry.registerPath({
  method: 'patch',
  path: '/todos/{id}',
  summary: 'todoの更新',
  request: {
    params: todosUpdateParam,
    body: {
      content: {
        'application/json': {
          schema: todosUpdateBody,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'todoの更新成功',
      content: {
        'application/json': {
          schema: z.object({}),
        },
      },
    },
  },
})
