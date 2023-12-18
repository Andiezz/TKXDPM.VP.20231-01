import mongoose, { Model, Schema, model } from 'mongoose'
import { ITrack } from '../interfaces/track.interface'

export class TrackModel {
    private static instance: Model<ITrack>

    private constructor() {}

    public static getInstance(): Model<ITrack> {
        if (!TrackModel.instance) {
            const trackSchema = new Schema<ITrack>(
                {
                    name: {
                        type: String,
                        required: true,
                    },
                    duration: {
                        type: Number,
                        required: true,
                    },
                    cdId: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'product',
                        required: true,
                    },
                },
                { timestamps: true }
            )

            TrackModel.instance = model('Track', trackSchema)
        }

        return TrackModel.instance
    }
}

