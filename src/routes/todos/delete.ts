import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'
import { todosMutation } from '../../database/mutation'
import { registry } from '../../utils/openapi'

const todosDeletePathParam = z.strictObject({
  id: z
    .string()
    .refine((v) => !isNaN(Number(v)), 'Invalid string. Expected numeric')
    .transform((v) => Number(v)),
})

export const todosDeleteRoute = new Hono().delete(
  '/',
  zValidator('param', todosDeletePathParam),
  async (ctx) => {
    const { id } = ctx.req.valid('param')

    // 物理削除ではなく論理削除する
    const result = await todosMutation.deleteOne(id)

    if (!result) {
      return ctx.body(null, 404)
    }

    return ctx.body(null, 200)
  },
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
