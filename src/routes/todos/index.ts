import { Hono } from 'hono'
import { todosCreateRoute } from './create'
import { todosDeleteRoute } from './delete'
import { todosIdRoute } from './id'
import { todosListRoute } from './list'
import { todosSearchRoute } from './search'
import { todosUpdateRoute } from './update'

export const todosRoute = new Hono()
  .route('/', todosListRoute)
  .route('/', todosCreateRoute)
  .route('/search', todosSearchRoute)
  .route('/:id', todosIdRoute)
  .route('/:id', todosUpdateRoute)
  .route('/:id', todosDeleteRoute)
