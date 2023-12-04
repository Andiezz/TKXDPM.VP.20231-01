import mongoose, { Schema, model } from 'mongoose'
import { DeliveryInfoModelDto } from '../../../../dtos/models/delivery-info-model.dto'

const deliveryInfoSchema = new Schema<DeliveryInfoModelDto>({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    province: {
        type: String,
        required: true,
    },
    instructions: {
        type: String,
        required: true,
    },
})

const DeliveryInfo = model<DeliveryInfoModelDto>(
    'DeliveryInfo',
    deliveryInfoSchema
)
export default DeliveryInfo
