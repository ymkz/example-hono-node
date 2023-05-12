import Database from 'better-sqlite3'
import { Logger } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { env } from '../utils/env'
import { logger } from '../utils/log'

class DatabaseLogger implements Logger {
  logQuery(query: string, params: unknown[]): void {
    logger.info({
      msg: 'database query runnning',
      sql: query.replaceAll(`"`, `'`), // クエリに含まれるdouble-quoteがエスケープされて見にくいsingle-quoteに変換
      params,
    })
  }
}

const sqlite = new Database(env.SQLITE_FILENAME)

export const db = drizzle(sqlite, { logger: new DatabaseLogger() })
