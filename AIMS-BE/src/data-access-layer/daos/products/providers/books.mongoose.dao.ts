import { Model } from 'mongoose'
import { IBook } from '../interfaces/book.interface'
import { ProductsDao } from '../interfaces/products.dao.interface'
import { ProductsMongooseDao } from './products.mongoose.dao'
import { BookModel } from '../schemas/book.model'

class BooksMongooseDao extends ProductsMongooseDao implements ProductsDao {
    constructor(private bookModel: Model<IBook> = BookModel.getInstance()) {
        super(bookModel)
    }
}

export default BooksMongooseDao
