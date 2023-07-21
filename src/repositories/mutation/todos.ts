import { sql } from 'kysely'
import { db } from '~/repositories'
import { Todo } from '~/repositories/schema/todos'

export const createOne = async (title: Todo['title']) => {
  const result = await db
    .insertInto('todos')
    .values({ title })
    .returningAll()
    .executeTakeFirstOrThrow()

  return result
}

/**
 * @description 論理削除
 */
export const deleteOne = async (id: Todo['id']) => {
  const result = await db
    .updateTable('todos')
    .set({ deleted_at: sql`DATETIME('now', 'localtime')` })
    .where('todos.id', '=', id)
    .returningAll()
    .executeTakeFirstOrThrow()

  return result
}

export const updateOne = async (
  id: number,
  title?: Todo['title'],
  status?: Todo['status'],
) => {
  const result = await db
    .updateTable('todos')
    .set({ title, status, updated_at: sql`DATETIME('now', 'localtime')` })
    .where('todos.id', '=', id)
    .where('todos.deleted_at', 'is', null)
    .returningAll()
    .executeTakeFirstOrThrow()

  return result
}
