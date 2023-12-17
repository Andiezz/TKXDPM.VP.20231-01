export class BaseResponse<T> {
    private status: number = 0
    private message: string = 'No message'
    private data: T | undefined
    constructor() {}

    ok(message: string, data?: T) {
        this.status = 1
        this.message = message
        this.data = data || undefined
        return this
    }

    fail(message: string, data?: T) {
        this.message = message
        this.data = data || undefined
        return this
    }
}
