import { IUser } from './user.interface'
import { CreateUserDto } from '../../../../dtos/users.dto'
import { Document } from 'mongodb'

export interface UsersDao {
    userModel: Document
    create(createUserDto: CreateUserDto, hashedPassword: string): Promise<IUser>
    findById(id: string): Promise<IUser | null>
    isExist(filter: Object): Promise<string | null>
    findOne(filter: Object): Promise<IUser | null>
}
