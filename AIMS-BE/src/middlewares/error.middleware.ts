import { Request, Response, NextFunction, RequestHandler } from 'express'
import { validationResult, ValidationError, Result } from 'express-validator'
import { CustomError, RequestValidationError } from '../errors'

export function ErrorMiddleware(
    error: any,
    req: Request,
    res: Response,
    next: NextFunction
): Response | void {
    const status = error.statusCode || 500
    if (error instanceof CustomError) {
        return res.status(status).json(error.serializeErrors())
    }
    console.error(error)
    return res.status(500).json({
        status: -600,
        message: 'Something went wrong',
    })
}

export const tryCatch =
    (f: RequestHandler) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const errors: Result<ValidationError> = validationResult(req)
            if (!errors.isEmpty()) {
                throw new RequestValidationError(errors.array())
            }
            await f(req, res, next)
        } catch (err: any) {
            if (!err.statusCode) {
                err.statusCode = 500
            }
            next(err)
        }
    }
