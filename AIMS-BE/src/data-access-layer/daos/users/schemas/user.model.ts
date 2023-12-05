import { Document } from 'mongodb'
import { Schema, model } from 'mongoose'
import { USER_STATUS } from '../../../../configs/constants'
import { USER_ROLE } from '../../../../configs/enums'
import { IUser } from '../interfaces/user.interface'

/**
 * The Singleton class defines the `getInstance` method that lets clients access
 * the unique singleton instance.
 */
export class UserModel {
    private static instance: Document

    /**
     * The Singleton's constructor should always be private to prevent direct
     * construction calls with the `new` operator.
     */
    private constructor() {}

    /**
     * The static method that controls the access to the singleton instance.
     *
     * This implementation let you subclass the Singleton class while keeping
     * just one instance of each subclass around.
     */
    public static getInstance(): UserModel {
        if (!UserModel.instance) {
            const userSchema = new Schema<IUser>(
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

            UserModel.instance = model('User', userSchema)
        }

        return UserModel.instance
    }
}
