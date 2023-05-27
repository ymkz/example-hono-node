import Database from 'better-sqlite3'
import { Generated, Kysely, SqliteDialect } from 'kysely'
import { env } from '../utils/env'
import { logger } from '../utils/log'

type DB = {
  todos: {
    id: Generated<number>
    title: string
    status: Generated<'progress' | 'pending' | 'done'>
    created_at: Generated<string>
    updated_at: string | null
    deleted_at: string | null
  }
}

export const db = new Kysely<DB>({
  dialect: new SqliteDialect({
    database: new Database(env.SQLITE_FILENAME),
  }),
  log: (event) => {
    if (event.level === 'error') {
      logger.error(event.error, 'sql error')
    }

    logger.info({
      msg: 'sql log',
      query: event.query.sql.replaceAll('"', '`'),
      params: event.query.parameters,
      durationMs: event.queryDurationMillis,
    })
  },
})
