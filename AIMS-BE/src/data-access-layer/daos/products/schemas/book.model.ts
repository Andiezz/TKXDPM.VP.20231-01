import { Model, Schema, model } from 'mongoose'
import { IProduct } from '../interfaces/product.interface'
import { IBook } from '../interfaces/book-model.dto'
import { ProductModel } from './product.model'
import { KIND } from '../../../../configs/enums'

export class BookModel {
    private static instance: Model<IBook>
    private static productModel: Model<IProduct>

    private constructor() {}

    public static getInstance(): Model<IBook> {
        BookModel.productModel = ProductModel.getInstance()
        if (!BookModel.instance) {
            const bookSchema = new Schema<IBook>({
                author: {
                    type: String,
                    required: true,
                },
                coverType: {
                    type: String,
                    required: true,
                },
                publisher: {
                    type: String,
                    required: true,
                },
                publicationDate: {
                    type: Date,
                    required: true,
                },
                pages: {
                    type: Number,
                    required: true,
                },
                language: {
                    type: String,
                    required: true,
                },
                bookCategory: {
                    type: String,
                    required: true,
                },
            })

            BookModel.instance = BookModel.productModel.discriminator<IBook>(
                KIND.BOOK,
                bookSchema
            )
        }

        return BookModel.instance
    }
}
