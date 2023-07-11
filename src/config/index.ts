import { createConfig } from 'envey'
import { z } from 'zod'

export const config = createConfig(z, {
  NODE_ENV: {
    env: 'NODE_ENV',
    format: z.enum(['production', 'development', 'test']),
  },
  SQLITE_FILENAME: {
    env: 'SQLITE_FILENAME',
    format: z.string(),
  },
})
