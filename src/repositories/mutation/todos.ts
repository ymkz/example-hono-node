import { sql } from 'kysely'
import { Todo } from '~/repositories/schema/todos'
import { db } from '..'

export const createOne = async (title: string) => {
  const result = await db
    .insertInto('todos')
    .values({ title })
    .returningAll()
    .executeTakeFirstOrThrow()

  return result
}

export const deleteOne = async (id: number) => {
  // 論理削除
  const result = await db
    .updateTable('todos')
    .set({ deleted_at: sql`DATETIME('now', 'localtime')` })
    .where('todos.id', '=', id)
    .returningAll()
    .executeTakeFirst()

  return result
}

export const updateOne = async (
  id: number,
  title?: Todo['title'],
  status?: Todo['status'],
) => {
  // 明示的にupdated_atを更新する（TRIGGERによるON_UPDATEではなくアプリケーション側が責務を持つ）
  const result = await db
    .updateTable('todos')
    .set({ title, status, updated_at: sql`DATETIME('now', 'localtime')` })
    .where('todos.id', '=', id)
    .where('todos.deleted_at', 'is', null)
    .returningAll()
    .executeTakeFirst() // idを条件指定しているため必ずひとつのみ更新されているはず

  return result
}
