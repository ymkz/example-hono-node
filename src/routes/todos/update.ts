import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'
import { ZodOpenApiOperationObject } from 'zod-openapi'
import { todoSchema } from '~/repositories/schema/todos'
import { todosMutation } from '../../repositories/mutation'

const todosUpdatePathParam = z.object({
  id: z
    .string()
    .refine((v) => !isNaN(Number(v)), 'Invalid string. Expected numeric')
    .transform((v) => Number(v)),
})
const todosUpdateBody = z.object({
  title: z.string().min(1).optional(),
  status: z.enum(['progress', 'pending', 'done']).optional(),
})
const response200 = todoSchema

export const todosUpdateRoute = new Hono().patch(
  '/todos/:id',
  zValidator('param', todosUpdatePathParam),
  zValidator('json', todosUpdateBody),
  async (ctx) => {
    const { id } = ctx.req.valid('param')
    const { title, status } = ctx.req.valid('json')

    const result = await todosMutation.updateOne(id, title, status)

    if (!result) {
      return ctx.body(null, 404)
    }

    return ctx.json(result)
  },
)

export const todosUpdateOperation: ZodOpenApiOperationObject = {
  description: 'Todoの更新',
  requestParams: {
    path: todosUpdatePathParam,
  },
  requestBody: {
    content: {
      'application/json': {
        schema: todosUpdateBody,
      },
    },
  },
  responses: {
    200: { content: { 'application/json': { schema: response200 } } },
    400: { content: { 'application/json': { schema: {} } } },
    404: { content: { 'application/json': { schema: {} } } },
    500: { content: { 'application/json': { schema: {} } } },
  },
}
