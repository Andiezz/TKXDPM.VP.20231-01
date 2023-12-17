export class BaseResponse {
    private status: number = 0
    private message: string = 'No message'
    private data: Object | undefined
    constructor() {}

    ok(message: string, data?: Object) {
        this.status = 1
        this.message = message
        this.data = data || undefined
        return this
    }

    fail(message: string, data?: Object) {
        this.message = message
        this.data = data || undefined
        return this
    }
}
