import { zValidator } from '@hono/zod-validator'
import { eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { z } from 'zod'
import { db } from '../../db'
import { Todo, todos } from '../../db/schemas/todos'
import { registry } from '../../utils/openapi'

const todosIdParam = z.object({
  id: z
    .string()
    .refine((v) => !isNaN(Number(v)), 'Invalid string. Expected numeric')
    .transform((v) => Number(v)),
})

export const todosIdRoute = new Hono().get(
  '/',
  zValidator('param', todosIdParam),
  (ctx) => {
    const { id } = ctx.req.valid('param')

    const result = db.select().from(todos).where(eq(todos.id, id)).get()

    if (!result) {
      return ctx.body(null, 404)
    }

    return ctx.json<Todo>(result)
  }
)

registry.registerPath({
  method: 'get',
  path: '/todos/{id}',
  summary: 'todoの取得',
  request: {
    params: todosIdParam,
  },
  responses: {
    200: {
      description: 'todoの取得成功',
      content: {
        'application/json': {
          schema: z.object({}),
        },
      },
    },
    404: {
      description: '対象のtodoが存在しない',
    },
  },
})
