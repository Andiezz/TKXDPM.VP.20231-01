import { Model, Schema, model } from 'mongoose'
import { IProduct } from '../interfaces/product.interface'

export class ProductModel {
    private static instance: Model<IProduct>

    private constructor() {}

    public static getInstance(): Model<IProduct> {
        if (!ProductModel.instance) {
            const productSchema = new Schema<IProduct>(
                {
                    title: {
                        type: String,
                        required: true,
                    },
                    category: {
                        type: String,
                        required: true,
                    },
                    price: {
                        type: Number,
                        required: true,
                    },
                    value: {
                        type: Number,
                        required: true,
                    },
                    importDate: {
                        type: Date,
                        required: true,
                    },
                    quantity: {
                        type: Number,
                        required: true,
                    },
                    description: {
                        type: String,
                        required: true,
                    },
                    productDimensions: {
                        type: Schema.Types.Mixed,
                        required: true,
                    },
                    barcode: {
                        type: String,
                        required: true,
                    },
                    supportRush: {
                        type: Boolean,
                        required: true,
                    },
                    image: {
                        type: String,
                        required: true,
                    },
                },
                { timestamps: true, discriminatorKey: 'kind' }
            )

            ProductModel.instance = model('Product', productSchema)
        }

        return ProductModel.instance
    }
}
