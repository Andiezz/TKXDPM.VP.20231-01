import { Model } from 'mongoose'
import { KIND } from '../../../configs/enums'
import { ProductsDao } from './interfaces/products.dao'
import BooksMongooseDao from './providers/books.mongoose.dao'
import { IBook } from './interfaces/book.interface'
import { BadRequestError } from '../../../errors'

class ProductDaoFactory {
    private productDaos: Record<string, ProductsDao>

    constructor(private bookModel: Model<IBook>) {
        this.productDaos = {}
        this.productDaos[KIND.BOOK] = new BooksMongooseDao(bookModel)
    }

    public getInstance(productType: KIND) {
        if (!this.productDaos[productType]) {
            throw new BadRequestError(
                'Request for quotation type not supported'
            )
        }
        return this.productDaos[productType]
    }
}

export default ProductDaoFactory
