import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'

const sqlite = new Database('db.sqlite')
const db = drizzle(sqlite)

migrate(db, { migrationsFolder: './migrations' })
