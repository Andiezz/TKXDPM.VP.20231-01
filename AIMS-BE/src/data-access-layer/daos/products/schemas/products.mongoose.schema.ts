import { Schema, model } from 'mongoose'
import { IProduct } from '../interfaces/product.interface'

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
    },
    { timestamps: true, discriminatorKey: 'kind' }
)

const Product = model<IProduct>('Product', productSchema)
export default Product
