import mongoose, { Schema, model } from 'mongoose'
import { TrackModelDto } from '../interfaces/track-model.dto'

const trackSchema = new Schema<TrackModelDto>({
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
    compactDiscId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cd',
        required: true,
    },
})

const Track = model<TrackModelDto>('Track', trackSchema)
export default Track
