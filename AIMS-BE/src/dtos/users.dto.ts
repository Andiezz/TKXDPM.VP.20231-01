import { UserModelDto } from './models/user-model.dto'

export type CreateUserDto = Pick<UserModelDto, 'email'>
