import { SUPPORTED_CURRENCY } from '../../../configs/enums'
import { PAYMENT_METHOD } from '../payment-gateway.factory'

export class PayRequestDto {
    invoiceId: string
    payment_method: PAYMENT_METHOD
    amount: number
    currency: SUPPORTED_CURRENCY
    ipAddress?: string

    constructor(input: {
        invoiceId: string
        payment_method: PAYMENT_METHOD
        amount: number
        currency: SUPPORTED_CURRENCY
        ipAddress: string
    }) {
        this.invoiceId = input.invoiceId
        this.payment_method = input.payment_method
        this.amount = input.amount
        this.currency = input.currency
        this.ipAddress = input.ipAddress
    }
}
