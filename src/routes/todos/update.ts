import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'
import { updateTodo } from '../../database/mutation/todos'
import { todo } from '../../database/schema/todos'
import { registry } from '../../utils/openapi'

const todosUpdatePathParam = z.strictObject({
  id: z
    .string()
    .refine((v) => !isNaN(Number(v)), 'Invalid string. Expected numeric')
    .transform((v) => Number(v)),
})

const todosUpdateBody = z.strictObject({
  title: z.string().min(1).optional(),
  status: z.enum(['progress', 'pending', 'done']).optional(),
})

export const todosUpdateRoute = new Hono().patch(
  '/',
  zValidator('param', todosUpdatePathParam),
  zValidator('json', todosUpdateBody),
  async (ctx) => {
    const { id } = ctx.req.valid('param')
    const { title, status } = ctx.req.valid('json')

    const result = await updateTodo(id, title, status)

    if (!result) {
      return ctx.body(null, 404)
    }

    return ctx.json(result)
  }
)

registry.registerPath({
  method: 'patch',
  path: '/todos/{id}',
  summary: 'todoの更新',
  request: {
    params: todosUpdatePathParam,
    body: {
      content: {
        'application/json': {
          schema: todosUpdateBody,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'todoの更新成功',
      content: {
        'application/json': {
          schema: todo,
        },
      },
    },
  },
})
