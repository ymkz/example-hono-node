import { serve } from '@hono/node-server'
import { logger } from '~/application/logging'
import { app } from '~/presentation'

const PORT = Number(process.env.PORT) || 4000

if (process.env.APP_ENV === 'local') {
  app.doc31('/spec/openapi.json', {
    openapi: '3.1.0',
    info: { version: '0.0.0', title: 'API仕様書' },
  })

  app.get('/spec', (ctx) => {
    return ctx.html(`<!DOCTYPE html>
<html>
  <head>
    <title>API仕様書</title>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1" />
    <style>
      body {
        margin: 0;
      }
    </style>
  </head>
  <body>
    <script
      id="api-reference"
      data-url="/spec/openapi.json"></script>
    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
  </body>
</html>`)
  })

  app.showRoutes()
}

serve({ fetch: app.fetch, hostname: '0.0.0.0', port: PORT }, () => {
  logger.info(`ready on NODE_ENV=${process.env.NODE_ENV}`)
  logger.info(`ready on APP_ENV=${process.env.APP_ENV}`)
  logger.info(`ready on http://localhost:${PORT}`)
})
