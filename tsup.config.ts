import { config } from 'dotenv'
import { defineConfig } from 'tsup'

config({ path: '.env.local' })

export default defineConfig({
  entry: ['src/index.ts'],
  format: 'esm',
  treeshake: true,
})
