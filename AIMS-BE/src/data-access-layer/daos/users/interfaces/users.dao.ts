import { CreateUserDto, UpdateUserInfoDto } from '../../../../dtos/users.dto'
import { IUser } from './user.interface'

export interface UsersDao {
    create(createUserDto: CreateUserDto, hashedPassword: string): Promise<IUser>
    findById(id: string): Promise<IUser | null>
    isExist(filter: Object): Promise<string | null>
    findOne(filter: Object): Promise<IUser | null>
    findAll(filter?: Object): Promise<IUser[] | []>
    seedAdmin(): Promise<void>
    updateInfo(
        userId: string,
        updateUserInfoDto: UpdateUserInfoDto
    ): Promise<IUser>
    delete(id: string): Promise<void>
    changePassword(id: string, newHashedPassword: string): Promise<void>
    changeStatus(id: string): Promise<void>
}
