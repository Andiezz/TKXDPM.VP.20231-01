import { SUPPORTED_CURRENCY } from '../../../configs/enums'
import { PAYMENT_METHOD } from '../payment-gateway.factory'

export class PayRequestDto {
    orderId: string
    paymentMethod: PAYMENT_METHOD
    amount: number
    currency: SUPPORTED_CURRENCY
    ipAddress?: string

    constructor(input: PayRequestDto) {
        this.orderId = input.orderId
        this.paymentMethod = input.paymentMethod
        this.amount = input.amount
        this.currency = input.currency
        this.ipAddress = input.ipAddress
    }
}
