import { CreateUserDto } from '../../../../dtos/users.dto'
import { IUser } from './user.interface'

export interface UsersDao {
    create(createUserDto: CreateUserDto, hashedPassword: string): Promise<IUser>
    findById(id: string): Promise<IUser | null>
    isExist(filter: Object): Promise<string | null>
    findOne(filter: Object): Promise<IUser | null>
}
