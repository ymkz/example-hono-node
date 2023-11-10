import { z } from '@hono/zod-openapi'

export const response400 = z.object({
  ok: z.literal(false),
  reason: z.optional(z.string()),
})

export const response404 = z.object({
  ok: z.literal(false),
  reason: z.optional(z.string()),
})

export const response500 = z.object({
  ok: z.literal(false),
  reason: z.optional(z.string()),
})
