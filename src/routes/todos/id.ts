import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'
import { ZodOpenApiOperationObject } from 'zod-openapi'
import { todoSchema } from '~/repositories/schema/todos'
import { todosQuery } from '../../repositories/query'

const requestPathParam = z.object({
  id: z
    .string()
    .refine((v) => !isNaN(Number(v)), 'Invalid string. Expected numeric')
    .transform((v) => Number(v)),
})
const response200 = todoSchema

export const todosIdRoute = new Hono().get(
  '/todos/:id',
  zValidator('param', requestPathParam),
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
    path: requestPathParam,
  },
  responses: {
    200: { content: { 'application/json': { schema: response200 } } },
    400: { content: { 'application/json': { schema: {} } } },
    404: { content: { 'application/json': { schema: {} } } },
    500: { content: { 'application/json': { schema: {} } } },
  },
}
