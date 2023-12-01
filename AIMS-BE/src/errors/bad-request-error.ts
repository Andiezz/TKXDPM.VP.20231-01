import { CustomError, ErrorResponse } from './custom-error'

export class BadRequestError extends CustomError {
    private readonly statusCode: number = 400
    static readonly RESPONSE_CODE: number = -600

    constructor(message: string) {
        super(message)
    }

    serializeErrors(): ErrorResponse {
        return {
            status: BadRequestError.RESPONSE_CODE,
            errors: [{ message: this.message }],
        }
    }
}
