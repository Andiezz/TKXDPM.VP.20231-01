import { UserModelDto } from '../../../dtos/models/user-model.dto'
import { UsersDao } from '../users.dao'
import UserModel from '../schemas/user.mongoose.schema'
import { CreateUserDto } from '../../../dtos/users.dto'
import { hashSync } from 'bcrypt'
import { BadRequestError } from '../../../errors'

export class UsersMongooseDao implements UsersDao {
    public async create(createUserDto: CreateUserDto): Promise<UserModelDto> {
        const isUserExist = await this.isExist({ email: createUserDto.email })
        if (isUserExist) {
            throw new BadRequestError('This email is already registered')
        }

        const hashedPassword = this.hashData(process.env.DEFAULT_PASSWORD!)
        const userDoc = await UserModel.create({
            ...createUserDto,
            password: hashedPassword,
        })
        const { _id, ...result } = userDoc.toObject()
        result.id = _id.toString()
        return result
    }

    public async findById(id: string): Promise<UserModelDto | null> {
        const userDoc = await UserModel.findById(id)

        return userDoc
    }

    public async isExist(filter: Object): Promise<string | null> {
        const result = await UserModel.exists(filter)
        return result ? result.toString() : null
    }

    // Helper
    private hashData(data: string): string {
        const SALT_ROUNDS = 11
        return hashSync(data, SALT_ROUNDS)
    }
}
