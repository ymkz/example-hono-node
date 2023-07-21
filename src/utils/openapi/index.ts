import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { stringify } from 'yaml'
import { createDocument } from 'zod-openapi'
import { todosCreateOperation } from '~/routes/todos/create'
import { todosDeleteOperation } from '~/routes/todos/delete'
import { todosIdOperation } from '~/routes/todos/id'
import { todosListOperation } from '~/routes/todos/list'
import { todosSearchOperation } from '~/routes/todos/search'
import { todosUpdateOperation } from '~/routes/todos/update'
import { logger } from '../logger'

export const writeOpenAPIDocument = () => {
  const docs = createDocument({
    openapi: '3.1.0',
    info: {
      version: '0.0.0',
      title: 'hono-on-node',
      description: 'Hono on NodeJS',
    },
    paths: {
      '/todos': {
        get: todosListOperation,
        post: todosCreateOperation,
      },
      '/todos/:id': {
        get: todosIdOperation,
        patch: todosUpdateOperation,
        delete: todosDeleteOperation,
      },
      '/todos/search': {
        get: todosSearchOperation,
      },
    },
  })

  writeFile(resolve(process.cwd(), 'docs/openapi.yaml'), stringify(docs)).then(
    () => {
      logger.info('generated openapi.yaml')
    },
  )
}
