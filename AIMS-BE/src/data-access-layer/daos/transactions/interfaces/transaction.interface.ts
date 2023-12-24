import { SUPPORTED_CURRENCY } from '../../../../configs/enums'
import { PAYMENT_METHOD } from '../../../../subsystems/payment-service'

export interface ITransaction {
    id: number | ObjectId | string
    status: number
    orderId: string
    paymentMethod: PAYMENT_METHOD
    amount: number
    currency: SUPPORTED_CURRENCY
    transactionNo: string
    content?: string
    captureId?: string
    createdAt: Date
}
