import { UserModelDto } from '../../dtos/models/user-model.dto'
import { CreateUserDto } from '../../dtos/users.dto'

export interface UsersDao {
    create(
        createUserDto: CreateUserDto,
        hashedPassword: string
    ): Promise<UserModelDto>
    findById(id: string): Promise<UserModelDto | null>
    isExist(filter: Object): Promise<string | null>
}
