import { Model, Schema } from 'mongoose'
import { IProduct } from '../interfaces/product.interface'
import { ProductModel } from './product.model'
import { KIND } from '../../../../configs/enums'
import { ILongPlay } from '../interfaces/long-play-model.dto'

export class LongPlayModel {
    private static instance: Model<ILongPlay>
    private static productModel: Model<IProduct>

    private constructor() {}

    public static getInstance(): Model<ILongPlay> {
        LongPlayModel.productModel = ProductModel.getInstance()
        if (!LongPlayModel.instance) {
            const longPlaySchema = new Schema<ILongPlay>({
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

            LongPlayModel.instance =
                LongPlayModel.productModel.discriminator<ILongPlay>(
                    KIND.LONG_PLAY,
                    longPlaySchema
                )
        }

        return LongPlayModel.instance
    }
}
