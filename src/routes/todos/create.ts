import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'
import { db } from '../../db'
import { registry } from '../../utils/openapi'

const todosCreateBody = z.strictObject({
  title: z.string().min(1),
})

export const todosCreateRoute = new Hono().post(
  '/',
  zValidator('json', todosCreateBody),
  async (ctx) => {
    const { title } = ctx.req.valid('json')

    const result = await db
      .insertInto('todos')
      .values({ title })
      .returningAll()
      .executeTakeFirstOrThrow()

    return ctx.json(result)
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
