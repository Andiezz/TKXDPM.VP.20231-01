import { Document, ObjectId } from 'mongodb'
import { CreateUserDto, UpdateUserInfoDto } from '../../../../dtos/users.dto'
import { IUser } from '../interfaces/user.interface'
import { UsersDao } from '../interfaces/users.dao'
import { UserModel } from '../schemas/user.model'
import { hashData } from '../../../../utils/security'
import { USER_ROLE } from '../../../../configs/enums'
import { isValidObjectId } from 'mongoose'
import { USER_STATUS } from '../../../../configs/constants'
export class UsersMongooseDao implements UsersDao {
    constructor(private userModel: Document = UserModel.getInstance()) {}

    public async seedAdmin(): Promise<void> {
        try {
            await this.userModel.create({
                email: 'admin@gmail.com',
                role: USER_ROLE.ADMIN,
                password: hashData(process.env.DEFAULT_PASSWORD!),
            })
            console.log('Seeded admin account successfully')
        } catch (e) {
            console.error('Seeded admin account fail')
        }
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
        if (!isValidObjectId(id)) {
            return null
        }

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

    public async findAll(filter?: Object): Promise<IUser[] | []> {
        const userDocs = await this.userModel.find({
            ...filter,
            role: { $ne: USER_ROLE.ADMIN },
        })

        const list = userDocs.map((v: Document) => {
            const { _id, password, ...result } = v.toObject()
            result.id = _id
            return result
        })

        return list
    }

    public async updateInfo(
        userId: string,
        updateUserInfoDto: UpdateUserInfoDto
    ): Promise<IUser> {
        const userDoc = await this.userModel.findByIdAndUpdate(userId, {
            name: updateUserInfoDto.name,
            phone: updateUserInfoDto.phone,
        })
        const { _id, ...result } = userDoc.toObject()
        result.id = _id

        return result
    }

    public async delete(id: string): Promise<void> {
        await this.userModel.deleteOne({ _id: id })
    }

    public async changePassword(
        id: string,
        newHashedPassword: string
    ): Promise<void> {
        await this.userModel.findByIdAndUpdate(id, {
            password: newHashedPassword,
        })
    }

    public async changeStatus(id: string): Promise<void> {
        const userDoc = await this.userModel.findById(id)
        const status =
            userDoc.status == USER_STATUS.BLOCKED
                ? USER_STATUS.ACTIVE
                : USER_STATUS.BLOCKED
        userDoc.status = status
        await userDoc.save()
    }
}
