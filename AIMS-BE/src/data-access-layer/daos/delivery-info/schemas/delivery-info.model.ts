import mongoose, { Schema, model } from 'mongoose'
import { Document } from 'mongodb'
import { IOrderProduct } from '../../order-product/interface/order-product.interface'
import { IDeliveryInfo } from '../interfaces/delivery-info.interface'
/**
 * The Singleton class defines the `getInstance` method that lets clients access
 * the unique singleton instance.
 */
export class DeliveryInfoModel {
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
    public static getInstance(): DeliveryInfoModel {
        if (!DeliveryInfoModel.instance) {
            const deliveryInfoSchema = new Schema<IDeliveryInfo>({
                name: {
                    type: String,
                    required: true,
                },
                email: {
                    type: String,
                    required: true,
                },
                phone: {
                    type: String,
                    required: true,
                },
                address: {
                    type: String,
                    required: true,
                },
                province: {
                    type: String,
                    required: true,
                },
                instructions: {
                    type: String,
                    required: true,
                },
                time: {
                    type: Date,
                    required: true,
                },
                deliveryMethod: {
                    type: String,
                    required: true,
                },
            }
            )
            DeliveryInfoModel.instance = model('DeliveryInfo', deliveryInfoSchema)
        }
        return DeliveryInfoModel.instance

    }
}
