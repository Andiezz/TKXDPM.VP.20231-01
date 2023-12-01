export abstract class CustomError extends Error {
    static readonly RESPONSE_CODE: number

    constructor(message: string) {
        super(message)
    }
    abstract serializeErrors(): ErrorResponse
}

export type ErrorResponse = {
    status: number
    errors: ErrorInfo[]
}

export type ErrorInfo = {
    message: string
    fields?: string
}
