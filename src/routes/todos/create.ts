import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'
import { ZodOpenApiOperationObject } from 'zod-openapi'
import { todosMutation } from '../../repositories/mutation'

const todosCreateBody = z.object({
  title: z.string().nonempty(),
})

export const todosCreateRoute = new Hono().post(
  '/',
  zValidator('json', todosCreateBody),
  async (ctx) => {
    const { title } = ctx.req.valid('json')

    const result = await todosMutation.createOne(title)

    return ctx.json(result)
  },
)

export const todosCreateOperation: ZodOpenApiOperationObject = {
  description: 'Todoの新規作成',
  requestBody: {
    content: {
      'application/json': {
        schema: todosCreateBody,
      },
    },
  },
  responses: {
    200: { content: { 'application/json': { schema: {} } } },
    400: { content: { 'application/json': { schema: {} } } },
    500: { content: { 'application/json': { schema: {} } } },
  },
}
