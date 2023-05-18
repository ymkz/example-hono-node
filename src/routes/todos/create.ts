import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'
import { db } from '../../db'
import { Todo, todos } from '../../db/schemas/todos'
import { registry } from '../../utils/openapi'

const todosCreateBody = z.object({
  title: z.string().min(1),
})

export const todosCreateRoute = new Hono().post(
  '/',
  zValidator('json', todosCreateBody),
  (ctx) => {
    const { title } = ctx.req.valid('json')

    const result = db.insert(todos).values({ title }).returning().get()

    return ctx.json<Todo>(result)
  }
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
          schema: z.object({}),
        },
      },
    },
  },
})
