import { aliasPath } from 'esbuild-plugin-alias-path'
import { resolve } from 'node:path'
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/**/*.ts'],
  format: 'esm',
  clean: true,
  bundle: true,
  treeshake: true,
  esbuildPlugins: [
    aliasPath({
      alias: {
        '~': resolve(process.cwd(), 'src'),
      },
    }),
  ],
})
