import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'

export const docsRoute = new Hono()
  .get('/', serveStatic({ path: 'docs/index.html' }))
  .get('/openapi.yaml', serveStatic({ path: 'docs/openapi.yaml' }))
