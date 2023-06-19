import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'
import { todosQuery } from '../../database/query'
import { todo } from '../../database/schema/todos'
import { registry } from '../../utils/openapi'

const todosIdPathParam = z.strictObject({
  id: z
    .string()
    .refine((v) => !isNaN(Number(v)), 'Invalid string. Expected numeric')
    .transform((v) => Number(v)),
})

export const todosIdRoute = new Hono().get(
  '/',
  zValidator('param', todosIdPathParam),
  async (ctx) => {
    const { id } = ctx.req.valid('param')

    const result = await todosQuery.findOneById(id)

    if (!result) {
      return ctx.body(null, 404)
    }

    return ctx.json(result)
  }
)

registry.registerPath({
  method: 'get',
  path: '/todos/{id}',
  summary: 'todoの取得',
  request: {
    params: todosIdPathParam,
  },
  responses: {
    200: {
      description: 'todoの取得成功',
      content: {
        'application/json': {
          schema: todo,
        },
      },
    },
    404: {
      description: '対象のtodoが存在しない',
    },
  },
})
