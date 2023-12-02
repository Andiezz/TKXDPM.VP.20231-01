import mongoose, { Schema, model } from 'mongoose'
import { PaymentTransactionModelDto } from '../../../dtos/models/payment-transaction-model.dto'

const paymentTransactionSchema = new Schema<PaymentTransactionModelDto>({
    content: {
        type: String,
        required: true,
    },
    method: {
        type: String,
        required: true,
    },
    cardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart',
        required: true,
    },
    invoiceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Invoice',
        required: true,
    },

})

const PaymentTransaction = model<PaymentTransactionModelDto>('OrderProduct', paymentTransactionSchema)
export default PaymentTransaction
