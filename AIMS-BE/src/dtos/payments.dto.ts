import { SUPPORTED_CURRENCY } from '../configs/enums'
import { PAYMENT_METHOD } from '../subsystems/payment-service'

export class CreateTransactionDto {
    orderId: string
    paymentMethod: PAYMENT_METHOD
    amount: number
    currency: SUPPORTED_CURRENCY
    content?: string
    captureId?: string

    constructor(input: {
        orderId: string
        paymentMethod: PAYMENT_METHOD
        amount: number
        currency: SUPPORTED_CURRENCY
        content?: string
        captureId?: string
    }) {
        this.orderId = input.orderId
        this.paymentMethod = input.paymentMethod
        this.amount = input.amount
        this.currency = input.currency
        this.content = input.content
        this.captureId = input.captureId
    }
}
