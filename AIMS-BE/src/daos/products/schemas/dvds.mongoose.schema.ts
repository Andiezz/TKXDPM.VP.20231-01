import { Schema } from 'mongoose'
import Product from './products.mongoose.schema'
import { DvdModelDto } from '../../../dtos/models/dvd-model.dto'

const dvdSchema = new Schema<DvdModelDto>({
    discType: {
        type: String,
        required: true,
    },
    director: {
        type: String,
        required: true,
    },
    runtime: {
        type: Number,
        required: true,
    },
    studio: {
        type: String,
        required: true,
    },
    language: {
        type: String,
        required: true,
    },
    releaseDate: {
        type: Date,
        required: true,
    },
    subtitle: {
        type: String,
        required: true,
    },
    genre: {
        type: String,
        required: true,
    },
})

const Dvd = Product.discriminator<DvdModelDto>('Dvd', dvdSchema);
export default Dvd