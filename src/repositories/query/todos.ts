import { db } from '~/repositories'
import { Todo } from '~/repositories/schema/todos'

export const findListByStatus = async (status: Todo['status'] = 'progress') => {
  const result = await db
    .selectFrom('todos')
    .selectAll()
    .where('todos.deleted_at', 'is', null)
    .where('todos.status', '=', status)
    .orderBy('todos.created_at', 'desc')
    .execute()

  return result
}

export const findOneById = async (id: Todo['id']) => {
  const result = await db
    .selectFrom('todos')
    .selectAll()
    .where('todos.id', '=', id)
    .where('todos.deleted_at', 'is', null)
    .limit(1)
    .executeTakeFirstOrThrow()

  return result
}

// TODO: 期間の絞り込みを実装する
export const search = async ({
  title,
  status,
  limit = 10,
  offset = 0,
}: {
  title?: Todo['title']
  status?: Todo['status']
  limit?: number
  offset?: number
}) => {
  let query = db
    .selectFrom('todos')
    .selectAll()
    .where('todos.deleted_at', 'is', null)
    .limit(limit)
    .offset(offset)
    .orderBy('todos.created_at', 'desc')

  if (title) {
    query = query.where('todos.title', 'like', `%${title}%`)
  }
  if (status) {
    query = query.where('todos.status', '=', status)
  }

  const result = await query.execute()

  return result
}
