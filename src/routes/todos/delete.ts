import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'
import { ZodOpenApiOperationObject } from 'zod-openapi'
import { todosMutation } from '~/repositories/mutation'

const requestPathParam = z.object({
  id: z
    .string()
    .refine((v) => !isNaN(Number(v)), 'Invalid string. Expected numeric')
    .transform((v) => Number(v)),
})
const response200 = z.null()

export const todosDeleteRoute = new Hono().delete(
  '/todos/:id',
  zValidator('param', requestPathParam),
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
    path: requestPathParam,
  },
  responses: {
    200: { content: { 'application/json': { schema: response200 } } },
    400: { content: { 'application/json': { schema: {} } } },
    404: { content: { 'application/json': { schema: {} } } },
    500: { content: { 'application/json': { schema: {} } } },
  },
}
