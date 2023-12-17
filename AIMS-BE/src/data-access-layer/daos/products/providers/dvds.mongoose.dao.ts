import { Model } from 'mongoose'
import { ProductsDao } from '../interfaces/products.dao'
import { ProductsMongooseDao } from './products.mongoose.dao'
import { DvdModel } from '../schemas/dvd.mongoose.schema'
import { IDvd } from '../interfaces/dvd.interface'

class DvdsMongooseDao extends ProductsMongooseDao implements ProductsDao {
    constructor(private dvdModel: Model<IDvd> = DvdModel.getInstance()) {
        super(dvdModel)
    }
}

export default DvdsMongooseDao
