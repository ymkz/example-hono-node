import { Todo } from '~/repositories/schema/todos'
import { db } from '..'

export const findAll = async (status: Todo['status']) => {
  const result = await db
    .selectFrom('todos')
    .selectAll()
    .where('todos.status', '=', status)
    .where('todos.deleted_at', 'is', null)
    .orderBy('todos.created_at', 'desc')
    .execute()

  return result
}

export const findOne = async (
  title?: Todo['title'],
  status?: Todo['status'],
) => {
  let query = db
    .selectFrom('todos')
    .selectAll()
    .orderBy('todos.created_at', 'desc')
    .where('todos.deleted_at', 'is', null)

  if (title) {
    query = query.where('todos.title', 'like', `%${title}%`)
  }
  if (status) {
    query = query.where('todos.status', '=', status)
  }

  const result = await query.execute()

  return result
}

export const findOneById = async (id: Todo['id']) => {
  const result = await db
    .selectFrom('todos')
    .selectAll()
    .where('todos.id', '=', id)
    .where('todos.deleted_at', 'is', null)
    .executeTakeFirst()

  return result
}
