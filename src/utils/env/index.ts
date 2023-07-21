/**
 * @see https://www.jacobparis.com/content/type-safe-env
 */

import { TypeOf, z } from 'zod'
import { logger } from '~/utils/logger'

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  SQLITE_FILE: z.string(),
})

declare global {
  namespace NodeJS {
    interface ProcessEnv extends TypeOf<typeof schema> {}
  }
}

try {
  schema.parse(process.env)
} catch (err) {
  if (err instanceof z.ZodError) {
    logger.fatal(
      { err: err.flatten().fieldErrors },
      'Missing environment variables',
    )
    process.exit(1)
  } else {
    logger.fatal(err, 'Unexpected error on parse environment variables')
    process.exit(1)
  }
}
