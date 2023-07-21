import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'

export const docsRoute = new Hono()
  .get('/example-hono-on-node/', serveStatic({ path: 'docs/index.html' }))
  .get(
    '/example-hono-on-node/openapi.yaml',
    serveStatic({ path: 'docs/openapi.yaml' }),
  )
