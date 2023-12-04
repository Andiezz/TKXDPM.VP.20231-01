import { UserModelDto } from '../../../../dtos/models/user-model.dto'
import { UsersDao } from '../users.dao'
import UserModel from '../schemas/user.mongoose.schema'
import { CreateUserDto } from '../../../../dtos/users.dto'
import { USER_ROLE } from '../../../../configs/enums'
import { hashData } from '../../../../utils/security'

export class UsersMongooseDao implements UsersDao {
    constructor() {
        const hash = hashData(process.env.DEFAULT_PASSWORD!)

        UserModel.exists({ role: USER_ROLE.GOD }).then((userDoc) => {
            if (userDoc) {
                return
            }
            UserModel.create({
                role: USER_ROLE.GOD,
                email: 'god@gmail.com',
                phone: '0912345678',
                password: hash,
                name: 'Jesus',
            }).then(() => console.log('[INFO] Init admin successfully'))
        })
    }

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

    public async findOne(filter: Object): Promise<UserModelDto | null> {
        const userDoc = await UserModel.findOne(filter)
        if (!userDoc) {
            return null
        }

        const { _id, ...result } = userDoc.toObject()
        result.id = _id
        return result
    }
}
