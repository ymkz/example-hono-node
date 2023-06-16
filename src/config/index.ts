import { createConfig, EnveySchema } from 'envey'
import { z } from 'zod'

const schema = {
  NODE_ENV: {
    env: 'NODE_ENV',
    format: z.enum(['production', 'development', 'test']).optional(),
  },
  SQLITE_FILENAME: {
    env: 'SQLITE_FILENAME',
    format: z.string(),
  },
} satisfies EnveySchema

export const config = createConfig(z, schema)
