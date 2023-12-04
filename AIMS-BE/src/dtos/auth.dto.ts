import { UserModelDto } from './models/user-model.dto'

export type LoginDto = Pick<UserModelDto, 'email' | 'password'>
