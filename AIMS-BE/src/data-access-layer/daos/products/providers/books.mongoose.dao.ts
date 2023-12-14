import { Model } from 'mongoose'
import { IBook } from '../interfaces/book.interface'
import { ProductsDao } from '../interfaces/products.dao'
import { ProductsMongooseDao } from './products.mongoose.dao'
import { IProduct } from '../interfaces/product.interface'

class BooksMongooseDao extends ProductsMongooseDao implements ProductsDao {
    constructor(private bookModel: Model<IBook>) {
        super(bookModel)
    }
}

export default BooksMongooseDao
