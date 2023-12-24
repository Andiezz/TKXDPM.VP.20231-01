import { CustomError, ErrorResponse } from './custom-error'

export class ForbiddenError extends CustomError {
    private readonly statusCode: number = 400
    static readonly RESPONSE_CODE: number = -611

    constructor(message: string) {
        super(message)
    }

    serializeErrors(): ErrorResponse {
        return {
            status: ForbiddenError.RESPONSE_CODE,
            errors: [{ message: this.message }],
        }
    }
}
