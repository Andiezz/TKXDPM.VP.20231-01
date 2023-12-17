import { Model, Schema } from 'mongoose'
import { IProduct } from '../interfaces/product.interface'
import { ProductModel } from './product.model'
import { KIND } from '../../../../configs/enums'
import { ICd } from '../interfaces/cd.interface'

export class CdModel {
    private static instance: Model<ICd>
    private static productModel: Model<IProduct>

    private constructor() {}

    public static getInstance(): Model<ICd> {
        CdModel.productModel = ProductModel.getInstance()
        if (!CdModel.instance) {
            const cdSchema = new Schema<ICd>({
                artist: {
                    type: String,
                    required: true,
                },
                recordLabel: {
                    type: String,
                    required: true,
                },
                genre: {
                    type: String,
                    required: true,
                },
                releaseDate: {
                    type: Date,
                    required: true,
                },
            })

            CdModel.instance = CdModel.productModel.discriminator<ICd>(
                KIND.CD,
                cdSchema
            )
        }

        return CdModel.instance
    }
}
