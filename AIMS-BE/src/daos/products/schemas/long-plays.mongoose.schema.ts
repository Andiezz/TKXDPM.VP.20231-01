import { Schema } from 'mongoose'
import Product from './products.mongoose.schema'
import { LongPlayModelDto } from '../../../dtos/models/long-play-model.dto';

const longPlaySchema = new Schema<LongPlayModelDto>({
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

const LongPlay = Product.discriminator<LongPlayModelDto>('LongPlay', longPlaySchema);
export default LongPlay
