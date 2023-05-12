import { InferModel, sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const todos = sqliteTable('todos', {
  id: integer('id').primaryKey(),
  title: text('title').notNull(),
  status: text('status', { enum: ['progress', 'pending', 'done'] })
    .notNull()
    .default('progress'),
  createdAt: text('created_at')
    .default(sql`DATETIME('now', 'localtime')`)
    .notNull(),
  updatedAt: text('updated_at'),
  deletedAt: text('deleted_at'),
})

export type Todo = InferModel<typeof todos>
