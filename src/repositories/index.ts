import Sqlite3Database from 'better-sqlite3'
import { Kysely, SqliteDialect } from 'kysely'
import { TodosTable } from '~/repositories/schema/todos'
import { logger } from '~/utils/logger'

type DB = {
  todos: TodosTable
}

export const db = new Kysely<DB>({
  dialect: new SqliteDialect({
    database: new Sqlite3Database(process.env.SQLITE_FILE),
  }),
  log: (event) => {
    logger.info(
      {
        query: event.query.sql.replaceAll('"', '`'),
        params: event.query.parameters,
        durationMs: event.queryDurationMillis,
      },
      'sql executed',
    )
    if (event.level === 'error') {
      logger.error(event.error, 'sql error occurred')
    }
  },
})
