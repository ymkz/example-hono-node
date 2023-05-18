import {
  OpenAPIGenerator,
  OpenAPIRegistry,
} from '@asteasolutions/zod-to-openapi'
import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import yaml from 'yaml'
import { logger } from '../log'

export const registry = new OpenAPIRegistry()

export const writeOpenAPIJson = async () => {
  const generator = new OpenAPIGenerator(registry.definitions, '3.1.0')

  const docs = generator.generateDocument({
    info: {
      version: '0.0.0',
      title: 'hono-nodejs',
      description: 'Hono on NodeJS',
    },
  })

  writeFile(
    resolve(process.cwd(), 'docs/openapi.yaml'),
    yaml.stringify(docs)
  ).then(() => {
    logger.info('openapi.yaml generated')
  })
}
