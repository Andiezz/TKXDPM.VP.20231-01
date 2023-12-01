import { Result, ValidationError } from 'express-validator'
import { CustomError, ErrorResponse } from './custom-error'

export class RequestValidationError extends CustomError {
    private readonly statusCode: number = 422
    static readonly RESPONSE_CODE: number = -622
    errors: ValidationError[]
    constructor(errors: ValidationError[]) {
        super('Invalid Request Body')
        this.errors = errors
    }

    serializeErrors(): ErrorResponse {
        return {
            status: RequestValidationError.RESPONSE_CODE,
            errors: this.errors.map((err: any) => {
                return { message: err.msg, field: err.path }
            }),
        }
    }
}
