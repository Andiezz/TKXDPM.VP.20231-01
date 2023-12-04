import { Schema } from 'mongoose'
import Product from './products.mongoose.schema'
import { BookModelDto } from '../../../../dtos/models/book-model.dto'

const bookSchema = new Schema<BookModelDto>({
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

const Book = Product.discriminator<BookModelDto>('Book', bookSchema)
export default Book
