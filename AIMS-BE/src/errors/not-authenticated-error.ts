import { CustomError, ErrorResponse } from './custom-error'

export class NotAuthenticatedError extends CustomError {
    private readonly statusCode: number = 401
    static readonly RSPONSE_CODE: number = -601

    constructor(message: string) {
        super(message)
    }

    serializeErrors(): ErrorResponse {
        return {
            status: NotAuthenticatedError.RESPONSE_CODE,
            errors: [{ message: this.message }],
        }
    }
}
