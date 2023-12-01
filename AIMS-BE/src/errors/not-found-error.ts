import { CustomError, ErrorResponse } from './custom-error'

export class NotFoundError extends CustomError {
    private readonly statusCode: number = 404
    static readonly RESPONSE_CODE: number = -604
    constructor() {
        super('Route not found')
    }

    serializeErrors(): ErrorResponse {
        return {
            status: NotFoundError.RESPONSE_CODE,
            errors: [{ message: '404 Not Found' }],
        }
    }
}
