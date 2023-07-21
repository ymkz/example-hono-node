import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'
import { ZodOpenApiOperationObject } from 'zod-openapi'
import { todosQuery } from '../../database/query'

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
  },
)

export const todosIdOperation: ZodOpenApiOperationObject = {
  description: 'Todoの取得',
  requestParams: {
    path: todosIdPathParam,
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
    404: {
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
