import { Schema } from 'mongoose'
import Product from './products.mongoose.schema'
import { CdModelDto } from '../../../dtos/models/cd-model.dto';

const cdSchema = new Schema<CdModelDto>({
    artist: {
        type: String,
        required: true,
    },
    recordLabel: {
        type: String,
        required: true,
    },
    genre: {
        type: String,
        required: true,
    },
    releaseDate: {
        type: Date,
        required: true,
    },
})

const Cd = Product.discriminator<CdModelDto>('Cd', cdSchema);
export default Cd
