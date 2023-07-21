import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'
import { ZodOpenApiOperationObject } from 'zod-openapi'
import { todosMutation } from '../../database/mutation'

const todosDeletePathParam = z.object({
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

export const todosDeleteOperation: ZodOpenApiOperationObject = {
  description: 'Todoの削除',
  requestParams: {
    path: todosDeletePathParam,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: {},
        },
      },
    },
    400: {
      content: {
        'application/json': {
          schema: {},
        },
      },
    },
    500: {
      content: {
        'application/json': {
          schema: {},
        },
      },
    },
  },
}
