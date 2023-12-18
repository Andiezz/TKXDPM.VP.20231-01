import mongoose, { Model, Schema, model } from 'mongoose'
import { Document } from 'mongodb'
import { IOrderProduct } from '../interface/order-product.interface'

/**
 * The Singleton class defines the `getInstance` method that lets clients access
 * the unique singleton instance.
 */
export class OrderProductModel {
    private static instance: Model<IOrderProduct>

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
    public static getInstance(): Model<IOrderProduct> {
        if (!OrderProductModel.instance) {
            const orderProductSchema = new Schema<IOrderProduct>({
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
            },
            { timestamps: true }
            )
            OrderProductModel.instance = model('OrderProduct', orderProductSchema)
        }
        return OrderProductModel.instance
    }
}
