import mongoose, { Schema, model } from 'mongoose'
import { CartModelDto } from '../../../../dtos/models/cart-model.dto'

const cartSchema = new Schema<CartModelDto>({
    totalPrice: {
        type: Number,
        required: true,
    },
    totalPriceVat: {
        type: Number,
        required: true,
    },
})

const Cart = model<CartModelDto>('Cart', cartSchema)
export default Cart
