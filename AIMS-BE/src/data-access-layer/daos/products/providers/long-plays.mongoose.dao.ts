import { Model } from 'mongoose'
import { ProductsDao } from '../interfaces/products.dao'
import { ProductsMongooseDao } from './products.mongoose.dao'
import { ILongPlay } from '../interfaces/long-play-model.dto'
import { LongPlayModel } from '../schemas/long-play.mongoose.schema'

class LongPlaysMongooseDao extends ProductsMongooseDao implements ProductsDao {
    constructor(private longPlayModel: Model<ILongPlay> = LongPlayModel.getInstance()) {
        super(longPlayModel)
    }
}

export default LongPlaysMongooseDao
