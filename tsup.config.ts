import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: 'esm',
  clean: true,
  bundle: true,
  treeshake: true,
})
