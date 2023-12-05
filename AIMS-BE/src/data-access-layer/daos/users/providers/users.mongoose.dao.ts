import { Document } from 'mongodb'
import { CreateUserDto } from '../../../../dtos/users.dto'
import { IUser } from '../interfaces/user.interface'
import { UsersDao } from '../interfaces/users.dao'
import { UserModel } from '../schemas/user.model'

export class UsersMongooseDao implements UsersDao {
    constructor(private userModel: Document = UserModel.getInstance()) {}

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
