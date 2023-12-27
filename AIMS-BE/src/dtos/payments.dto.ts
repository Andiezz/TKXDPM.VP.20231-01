import { SUPPORTED_CURRENCY } from '../configs/enums'
import { PAYMENT_METHOD } from '../subsystems/payment-service'

export class CreateTransactionDto {
    orderId: string | ObjectId
    paymentMethod: PAYMENT_METHOD
    amount: number
    currency: SUPPORTED_CURRENCY
    content?: string
    captureId?: string

    constructor(input: CreateTransactionDto) {
        this.orderId = input.orderId
        this.paymentMethod = input.paymentMethod
        this.amount = input.amount
        this.currency = input.currency
        this.content = input.content
        this.captureId = input.captureId
    }
}
