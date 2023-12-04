import { Schema, model } from 'mongoose'
import { USER_STATUS } from '../../../../configs/constants'
import { UserModelDto } from '../../../../dtos/models/user-model.dto'

const userSchema = new Schema<UserModelDto>(
    {
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
            min: 3,
        },
        status: {
            type: Number,
            default: USER_STATUS.ACTIVE,
        },
        name: String,
        phone: String,
        refreshToken: String,
    },
    { timestamps: true }
)

export default model('User', userSchema)
