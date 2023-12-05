import { IUser } from '../interfaces/user.interface'
import { UsersDao } from '../interfaces/users.dao'
import { CreateUserDto } from '../../../../dtos/users.dto'
import { USER_ROLE } from '../../../../configs/enums'
import { Schema, model } from 'mongoose'
import { USER_STATUS } from '../../../../configs/constants'
import { Document } from 'mongodb'

export class UsersMongooseDao implements UsersDao {
    public readonly userModel: Document

    constructor() {
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

        this.userModel = model('User', userSchema)
    }

    public async create(
        createUserDto: CreateUserDto,
        hashedPassword: string
    ): Promise<IUser> {
        const userDoc = await this.userModel.create({
            ...createUserDto,
            password: hashedPassword,
        })
        const { _id, ...result } = userDoc.toObject()
        result.id = _id
        return result
    }

    public async findById(id: string): Promise<IUser | null> {
        const userDoc = await this.userModel.findById(id)
        if (!userDoc) {
            return null
        }

        const { _id, ...result } = userDoc.toObject()
        result.id = _id
        return result
    }

    public async isExist(filter: Object): Promise<string | null> {
        const result = await this.userModel.exists(filter)
        return result ? result.toString() : null
    }

    public async findOne(filter: Object): Promise<IUser | null> {
        const userDoc = await this.userModel.findOne(filter)
        if (!userDoc) {
            return null
        }

        const { _id, ...result } = userDoc.toObject()
        result.id = _id
        return result
    }
}
