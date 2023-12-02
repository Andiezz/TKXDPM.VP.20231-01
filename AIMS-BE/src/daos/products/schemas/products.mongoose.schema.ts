import { Schema, model } from 'mongoose'
import { ProductModelDto } from '../../../dtos/models/product-model.dto'

const productSchema = new Schema<ProductModelDto>(
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

const Product = model<ProductModelDto>('Product', productSchema)
export default Product
