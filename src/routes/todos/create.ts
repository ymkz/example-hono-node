import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'
import { todosMutation } from '../../database/mutation'
import { todo } from '../../database/schema/todos'
import { registry } from '../../utils/openapi'

const todosCreateBody = z.strictObject({
  title: z.string().min(1),
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

registry.registerPath({
  method: 'post',
  path: '/todos',
  summary: 'todoの新規作成',
  request: {
    body: {
      content: {
        'application/json': {
          schema: todosCreateBody,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'todoの新規作成成功',
      content: {
        'application/json': {
          schema: todo,
        },
      },
    },
  },
})
