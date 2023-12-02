import mongoose, { Schema, model } from 'mongoose'
import { OrderModelDto } from '../../../dtos/models/order-model.dto'

const orderSchema = new Schema<OrderModelDto>({
    totalPrice: {
        type: Number,
        required: true,
    },
    totalPriceVat: {
        type: Number,
        required: true,
    },
    shippingFee: {
        type: Number,
        required: true,
    },
    deliveryInfoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DeliveryInfo',
        required: true,
    },
})

const Order = model<OrderModelDto>('Order', orderSchema)
export default Order
