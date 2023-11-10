import { Context, ErrorHandler, NotFoundHandler } from 'hono'
import { ZodError } from 'zod'
import { fromZodError } from 'zod-validation-error'
import { logger } from '~/application/logging'

export const notFoundHandler: NotFoundHandler = (ctx) => {
  logger.warn(
    { req: { url: ctx.req.url, method: ctx.req.method } },
    '存在しないパスへのリクエストが発生しました',
  )
  return ctx.json({ ok: false }, 404)
}

export const errorHandler: ErrorHandler = (err, ctx) => {
  logger.error(err, '予期しないエラーが発生しました')
  return ctx.json({ ok: false }, 500)
}

type Result =
  | { success: true; data: unknown }
  | { success: false; error: ZodError }

export const validationHook = (result: Result, ctx: Context) => {
  if (!result.success) {
    logger.warn(result.error.flatten(), 'バリデーションでエラーが発生しました')
    return ctx.json(
      {
        ok: false,
        reason: fromZodError(result.error).message,
      },
      400,
    )
  }
}
