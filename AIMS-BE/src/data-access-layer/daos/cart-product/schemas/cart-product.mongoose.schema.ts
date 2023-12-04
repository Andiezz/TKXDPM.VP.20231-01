import mongoose, { Schema, model } from 'mongoose'
import { CartProductModelDto } from '../../../../dtos/models/cart-product-model.dto'

const cartProductSchema = new Schema<CartProductModelDto>({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    cartId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart',
        required: true,
    },
})
const CartProduct = model<CartProductModelDto>('CartProduct', cartProductSchema)
export default CartProduct
