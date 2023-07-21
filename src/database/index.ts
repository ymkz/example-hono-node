import Database from 'better-sqlite3'
import { Kysely, SqliteDialect } from 'kysely'
import { logger } from '../utils/logger'
import { TodosTable } from './schema/todos'

type DB = {
  todos: TodosTable
}

export const db = new Kysely<DB>({
  dialect: new SqliteDialect({
    database: new Database(process.env.SQLITE_FILE),
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
