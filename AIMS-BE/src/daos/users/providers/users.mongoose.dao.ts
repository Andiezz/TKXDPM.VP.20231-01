import { UserModelDto } from '../../../dtos/models/user-model.dto'
import { UsersDao } from '../users.dao'
import UserModel from '../schemas/user.mongoose.schema'
import { CreateUserDto } from '../../../dtos/users.dto'

export class UsersMongooseDao implements UsersDao {
    public async create(
        createUserDto: CreateUserDto,
        hashedPassword: string
    ): Promise<UserModelDto> {
        const userDoc = await UserModel.create({
            ...createUserDto,
            password: hashedPassword,
        })
        const { _id, ...result } = userDoc.toObject()
        result.id = _id
        return result
    }

    public async findById(id: string): Promise<UserModelDto | null> {
        const userDoc = await UserModel.findById(id)
        if (!userDoc) {
            return null
        }

        const { _id, ...result } = userDoc.toObject()
        result.id = _id
        return result
    }

    public async isExist(filter: Object): Promise<string | null> {
        const result = await UserModel.exists(filter)
        return result ? result.toString() : null
    }
}
