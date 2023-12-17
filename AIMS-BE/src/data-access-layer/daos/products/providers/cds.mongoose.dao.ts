import { Model } from 'mongoose'
import { ProductsDao } from '../interfaces/products.dao'
import { ProductsMongooseDao } from './products.mongoose.dao'
import { ICd } from '../interfaces/cd.interface'
import { CdModel } from '../schemas/cd.model'

class CdsMongooseDao extends ProductsMongooseDao implements ProductsDao {
    constructor(private cdModel: Model<ICd> = CdModel.getInstance()) {
        super(cdModel)
    }
}

export default CdsMongooseDao
