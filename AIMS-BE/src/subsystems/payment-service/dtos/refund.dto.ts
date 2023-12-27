export class RefundRequestDto {
    orderId: string | ObjectId
    transactionDate?: Date
    amount: number
    ipAddress: string
    captureId?: string

    constructor(input: RefundRequestDto) {
        this.orderId = input.orderId
        this.amount = input.amount
        this.transactionDate = input.transactionDate
        this.amount = input.amount
        this.ipAddress = input.ipAddress
        this.captureId = input.captureId
    }
}
