import { Schema, model } from 'mongoose'
import { USER_STATUS } from '../../../../configs/constants'
import { UserModelDto } from '../../../../dtos/models/user-model.dto'
import { USER_ROLE } from '../../../../configs/enums'

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
        role: {
            type: String,
            default: USER_ROLE.ADMIN,
            enum: USER_ROLE,
        },
        name: String,
        phone: String,
    },
    { timestamps: true }
)

export default model('User', userSchema)
