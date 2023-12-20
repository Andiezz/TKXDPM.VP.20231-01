import mongoose, { Model, Schema, model } from 'mongoose'
import { Document } from 'mongodb'
import { ICartProduct } from '../interfaces/cart-product.interface'

/**
 * The Singleton class defines the `getInstance` method that lets clients access
 * the unique singleton instance.
 */
export class CartProductModel {
    private static instance: Model<ICartProduct>

    /**
     * The Singleton's constructor should always be private to prevent direct
     * construction calls with the `new` operator.
     */
    private constructor() {}

    /**
     * The static method that controls the access to the singleton instance.
     *
     * This implementation let you subclass the Singleton class while keeping
     * just one instance of each subclass around.
     */
    public static getInstance(): Model<ICartProduct> {
        if (!CartProductModel.instance) {
            const cartProductSchema = new Schema<ICartProduct>({
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
                quantity: {
                    type: Number,
                    required: true,
                },
            },{ timestamps: true }
            )
            CartProductModel.instance = model('CartProduct', cartProductSchema)
        }
        return CartProductModel.instance
    }
}