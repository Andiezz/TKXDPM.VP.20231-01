import { CustomError, ErrorResponse } from './custom-error'

export class NotAuthorizedError extends CustomError {
    private readonly statusCode: number = 403
    static readonly RESPONSE_CODE: number = -603
    constructor(message: string) {
        super(message)
    }

    serializeErrors(): ErrorResponse {
        return {
            status: NotAuthorizedError.RESPONSE_CODE,
            errors: [{ message: this.message }],
        }
    }
}
