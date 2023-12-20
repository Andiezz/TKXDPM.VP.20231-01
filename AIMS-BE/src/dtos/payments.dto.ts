import { SUPPORTED_CURRENCY } from '../configs/enums'
import { PAYMENT_METHOD } from '../subsystems/payment-service'

export class CreateTransactionDto {
    invoiceId: string
    paymentMethod: PAYMENT_METHOD
    amount: number
    currency: SUPPORTED_CURRENCY
    paymentDate: number
    content?: string

    constructor(input: {
        invoiceId: string
        paymentMethod: PAYMENT_METHOD
        amount: number
        currency: SUPPORTED_CURRENCY
        paymentDate: number
        content?: string
    }) {
        this.invoiceId = input.invoiceId
        this.paymentMethod = input.paymentMethod
        this.amount = input.amount
        this.currency = input.currency
        this.paymentDate = input.paymentDate
        this.content = input.content
    }
}
