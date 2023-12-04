import mongoose, { Schema, model } from 'mongoose'
import { Card } from '../../../dtos/models/card-model.dto'

const cardSchema = new Schema<Card>({
    cardCode: {
        type: String,
        required: true,
    },
    owner: {
        type: String,
        required: true,
    },
    cvvCode: {
        type: String,
        required: true,
    },
    dateExpiry: {
        type: Date,
        required: true,
    },
})

const Card = model<Card>('Card', cardSchema)
export default Card
