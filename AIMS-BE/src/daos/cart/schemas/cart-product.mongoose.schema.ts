import mongoose, { Schema, model } from 'mongoose'
import { CartModelDto } from '../../../dtos/models/cart-model.dto'

const cartProductSchema = new Schema<CartModelDto>({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    cartId: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'Cart',
        required: true,
    }
})
const CartProduct = model<CartModelDto>('CartProduct', cartProductSchema)
export default CartProduct