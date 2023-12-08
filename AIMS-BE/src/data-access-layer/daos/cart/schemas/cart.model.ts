import { Document } from 'mongodb'
import mongoose, { Schema, model } from 'mongoose'
import { ICart } from '../interfaces/cart.interface'


/**
 * The Singleton class defines the `getInstance` method that lets clients access
 * the unique singleton instance.
 */
export class CartModel {
    private static instance: Document

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
    public static getInstance(): CartModel {
        if (!CartModel.instance) {
            const cartSchema = new Schema<ICart>({
                totalPrice: {
                    type: Number,
                    required: true,
                },
                totalPriceVat: {
                    type: Number,
                    required: true,
                },
            },
            { timestamps: true })

            CartModel.instance = model('Cart', cartSchema)
        }

        return CartModel.instance
    }
    
}