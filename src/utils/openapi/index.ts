import {
  OpenApiGeneratorV31,
  OpenAPIRegistry,
} from '@asteasolutions/zod-to-openapi'
import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { stringify } from 'yaml'
import { logger } from '../logger'

export const registry = new OpenAPIRegistry()

export const writeOpenAPIDocument = () => {
  const generator = new OpenApiGeneratorV31(registry.definitions)

  const docs = generator.generateDocument({
    openapi: '3.1.0',
    info: {
      version: '0.0.0',
      title: 'hono-nodejs',
      description: 'Hono on NodeJS',
    },
  })

  writeFile(resolve(process.cwd(), 'docs/openapi.yaml'), stringify(docs)).then(
    () => {
      logger.info('openapi.yaml generated')
    }
  )
}
