import mongoose, { Schema, model } from 'mongoose'
import { IOrder } from '../interfaces/order.interface'
import { Document } from 'mongodb'
import { ORDER_STATUS } from '../../../../configs/enums'



export class OrderModel {
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
    public static getInstance(): OrderModel {
        if (!OrderModel.instance) {
            const orderSchema = new Schema<IOrder>(
                {
                    totalPrice: {
                        type: Number,
                        required: true,
                    },
                    totalPriceVAT: {
                        type: Number,
                        required: true,
                    },
                    status: {
                        type: Number,
                        default: ORDER_STATUS.PENDING,
                        enum: ORDER_STATUS,
                    },
                },
                { timestamps: true }
            )
            OrderModel.instance = model('Order', orderSchema)

        }
        return OrderModel.instance
    }

}
