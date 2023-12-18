import { PAYMENT_METHOD } from '../payment-gateway.factory'

export type RefundRequestDto = {
    payment_method: PAYMENT_METHOD
    payment_id: string
}
