import { Model } from 'mongoose'
import { ProductsDao } from '../interfaces/products.dao.interface'
import { ProductsMongooseDao } from './products.mongoose.dao'
import { ILongPlay } from '../interfaces/long-play.interface'
import { LongPlayModel } from '../schemas/long-play.model'

class LongPlaysMongooseDao extends ProductsMongooseDao implements ProductsDao {
    constructor(
        private longPlayModel: Model<ILongPlay> = LongPlayModel.getInstance()
    ) {
        super(longPlayModel)
    }
}

export default LongPlaysMongooseDao
