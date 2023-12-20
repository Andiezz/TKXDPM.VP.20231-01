import { Model, Schema } from 'mongoose'
import { IProduct } from '../interfaces/product.interface'
import { ProductModel } from './product.model'
import { KIND } from '../../../../configs/enums'
import { IDvd } from '../interfaces/dvd.interface'

export class DvdModel {
    private static instance: Model<IDvd>
    private static productModel: Model<IProduct>

    private constructor() {}

    public static getInstance(): Model<IDvd> {
        DvdModel.productModel = ProductModel.getInstance()
        if (!DvdModel.instance) {
            const dvdSchema = new Schema<IDvd>({
                discType: {
                    type: String,
                    required: true,
                },
                director: {
                    type: String,
                    required: true,
                },
                runtime: {
                    type: Number,
                    required: true,
                },
                studio: {
                    type: String,
                    required: true,
                },
                language: {
                    type: String,
                    required: true,
                },
                releaseDate: {
                    type: Date,
                    required: true,
                },
                subtitle: {
                    type: String,
                    required: true,
                },
                genre: {
                    type: String,
                    required: true,
                },
            })

            DvdModel.instance = DvdModel.productModel.discriminator<IDvd>(
                KIND.DVD,
                dvdSchema
            )
        }

        return DvdModel.instance
    }
}
