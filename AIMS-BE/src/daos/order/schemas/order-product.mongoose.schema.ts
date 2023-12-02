import mongoose, { Schema, model } from 'mongoose'
import { OrderProductModelDto } from '../../../dtos/models/order-product-model.dto'

const orderProductSchema = new Schema<OrderProductModelDto>({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
})

const OrderProduct = model<OrderProductModelDto>('OrderProduct', orderProductSchema)
export default OrderProduct
