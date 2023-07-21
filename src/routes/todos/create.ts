import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'
import { ZodOpenApiOperationObject } from 'zod-openapi'
import { todoSchema } from '~/repositories/schema/todos'
import { todosMutation } from '../../repositories/mutation'

const requestBody = z.object({
  title: z.string().nonempty(),
})
const response200 = todoSchema

export const todosCreateRoute = new Hono().post(
  '/todos',
  zValidator('json', requestBody),
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
        schema: requestBody,
      },
    },
  },
  responses: {
    200: { content: { 'application/json': { schema: response200 } } },
    400: { content: { 'application/json': { schema: {} } } },
    500: { content: { 'application/json': { schema: {} } } },
  },
}
