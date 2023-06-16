import Database from 'better-sqlite3'
import { Generated, Kysely, SqliteDialect } from 'kysely'
import { config } from '../config'
import { logger } from '../utils/logger'

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
    database: new Database(config.SQLITE_FILENAME),
  }),
  log: (event) => {
    logger.info(
      {
        query: event.query.sql.replaceAll('"', '`'),
        params: event.query.parameters,
        durationMs: event.queryDurationMillis,
      },
      'sql executed'
    )
    if (event.level === 'error') {
      logger.error(event.error, 'sql error occurred')
    }
  },
})
