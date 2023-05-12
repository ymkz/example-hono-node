import { zValidator } from '@hono/zod-validator'
import { and, desc, eq, isNull, sql } from 'drizzle-orm'
import { Hono } from 'hono'
import { z } from 'zod'
import { db } from '../../db'
import { Todo, todos } from '../../db/schemas/todos'

const todoApp = new Hono()

export const todosRoute = todoApp
  .get(
    '/',
    zValidator(
      'query',
      z.object({
        status: z.enum(['progress', 'pending', 'done']).default('progress'),
      })
    ),
    (ctx) => {
      const { status } = ctx.req.valid('query')

      const result = db
        .select()
        .from(todos)
        .where(and(eq(todos.status, status), isNull(todos.deletedAt)))
        .orderBy(desc(todos.createdAt))
        .all()

      return ctx.json<{ todos: Todo[] }>({
        todos: result,
      })
    }
  )
  .get(
    '/search',
    zValidator(
      'query',
      z.object({
        title: z.string().min(1).optional(),
        status: z.enum(['progress', 'pending', 'done']).optional(),
      })
    ),
    (ctx) => {
      const { title, status } = ctx.req.valid('query')

      const query = db.select().from(todos).orderBy(desc(todos.createdAt))

      // FIXME: 条件が多くなると分岐が増えて崩壊する。ただ適切な実装が不明。
      if (title && status) {
        query.where(
          and(
            eq(todos.title, title),
            eq(todos.status, status),
            isNull(todos.deletedAt)
          )
        )
      } else if (title) {
        query.where(and(eq(todos.title, title), isNull(todos.deletedAt)))
      } else if (status) {
        query.where(and(eq(todos.status, status), isNull(todos.deletedAt)))
      }

      const result = query.all()

      return ctx.json<{ todos: Todo[] }>({
        todos: result,
      })
    }
  )
  .get(
    '/:id',
    zValidator(
      'param',
      z.object({
        id: z
          .string()
          .refine((v) => !isNaN(Number(v)), 'Invalid numeric string')
          .transform((v) => Number(v)),
      })
    ),
    (ctx) => {
      const { id } = ctx.req.valid('param')

      const result = db.select().from(todos).where(eq(todos.id, id)).get()

      if (!result) {
        return ctx.body(null, 404)
      }

      return ctx.json<{ todo: Todo }>({
        todo: result,
      })
    }
  )
  .post(
    '/',
    zValidator(
      'json',
      z.object({
        title: z.string().min(1),
      })
    ),
    (ctx) => {
      const { title } = ctx.req.valid('json')

      const result = db.insert(todos).values({ title }).returning().get()

      return ctx.json<{ success: true; data: Todo }>({
        success: true,
        data: result,
      })
    }
  )
  .patch(
    '/:id',
    zValidator(
      'param',
      z.object({
        id: z
          .string()
          .refine((v) => !isNaN(Number(v)), 'Invalid numeric string')
          .transform((v) => Number(v)),
      })
    ),
    zValidator(
      'json',
      z.object({
        title: z.string().min(1).optional(),
        status: z.enum(['progress', 'pending', 'done']).optional(),
      })
    ),
    (ctx) => {
      const { id } = ctx.req.valid('param')
      const { title, status } = ctx.req.valid('json')

      // 明示的にupdatedAtを更新する（TRIGGERによるON_UPDATEではなくアプリケーション側が責務を持つ）
      const result = db
        .update(todos)
        .set({ title, status, updatedAt: sql`DATETIME('now', 'localtime')` })
        .where(eq(todos.id, id))
        .returning()
        .get()

      if (!result) {
        return ctx.body(null, 404)
      }

      return ctx.json<{ success: true; data: Todo }>({
        success: true,
        data: result,
      })
    }
  )
  .delete(
    '/:id',
    zValidator(
      'param',
      z.object({
        id: z
          .string()
          .refine((v) => !isNaN(Number(v)), 'Invalid numeric string')
          .transform((v) => Number(v)),
      })
    ),
    (ctx) => {
      const { id } = ctx.req.valid('param')

      // 論理削除
      const result = db
        .update(todos)
        .set({ deletedAt: sql`DATETIME('now', 'localtime')` })
        .where(eq(todos.id, id))
        .returning()
        .get()

      if (!result) {
        return ctx.body(null, 404)
      }

      return ctx.json<{ success: true }>({
        success: true,
      })
    }
  )
