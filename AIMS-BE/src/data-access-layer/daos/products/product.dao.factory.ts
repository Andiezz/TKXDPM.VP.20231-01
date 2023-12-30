import { Model } from 'mongoose'
import { KIND } from '../../../configs/enums'
import { ProductsDao } from './interfaces/products.dao.interface'
import BooksMongooseDao from './providers/books.mongoose.dao'
import { IBook } from './interfaces/book.interface'
import { BadRequestError } from '../../../errors'
import CdsMongooseDao from './providers/cds.mongoose.dao'
import DvdsMongooseDao from './providers/dvds.mongoose.dao'
import LongPlaysMongooseDao from './providers/long-plays.mongoose.dao'

class ProductDaoFactory {
    private productDaos: Record<string, ProductsDao>
    private bookDao: ProductsDao
    private cdDao: ProductsDao
    private dvdDao: ProductsDao
    private longPlayDao: ProductsDao

    constructor() {
        this.bookDao = new BooksMongooseDao()
        this.cdDao = new CdsMongooseDao()
        this.dvdDao = new DvdsMongooseDao()
        this.longPlayDao = new LongPlaysMongooseDao()
        this.productDaos = {}
        this.productDaos[KIND.BOOK] = this.bookDao
        this.productDaos[KIND.CD] = this.cdDao
        this.productDaos[KIND.DVD] = this.dvdDao
        this.productDaos[KIND.LONG_PLAY] = this.longPlayDao
    }

    public getInstance(productType: KIND) {
        if (!this.productDaos[productType]) {
            throw new BadRequestError(
                'Request for product kind not supported'
            )
        }
        return this.productDaos[productType]
    }
}

export default ProductDaoFactory
