import mongoose, { Schema, model } from 'mongoose'
import { Invoice } from '../../../../dtos/models/invoice-model.dto'

const invoiceSchema = new Schema<Invoice>({
    totalAmount: {
        type: Number,
        required: true,
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
    },
})

const Invoice = model<Invoice>('Invoice', invoiceSchema)
export default Invoice
