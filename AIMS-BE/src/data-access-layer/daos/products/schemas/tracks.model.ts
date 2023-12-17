import mongoose, { Schema, model } from 'mongoose'
import { ITrack } from '../interfaces/track.interface'

const trackSchema = new Schema<ITrack>({
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

const Track = model<ITrack>('Track', trackSchema)
export default Track
