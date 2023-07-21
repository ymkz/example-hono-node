import { Generated } from 'kysely'
import { z } from 'zod'

export type TodosTable = {
  id: Generated<number>
  title: string
  status: Generated<'progress' | 'pending' | 'done'>
  created_at: Generated<string>
  updated_at: string | null
  deleted_at: string | null
}

export const todoSchema = z.object({
  id: z.number(),
  title: z.string(),
  status: z.enum(['progress', 'pending', 'done']),
  created_at: z.string(),
  updated_at: z.string().nullable(),
  deleted_at: z.string().nullable(),
})

export const todosSchema = todoSchema.array()

export type Todo = z.infer<typeof todoSchema>

export type Todos = z.infer<typeof todosSchema>
