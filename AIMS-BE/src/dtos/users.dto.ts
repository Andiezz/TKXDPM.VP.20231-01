import { IUser } from '../data-access-layer/daos/users/interfaces/user.interface'

export type CreateUserDto = Pick<IUser, 'email'>

export type UpdateUserInfoDto = Pick<IUser, 'name' | 'phone'>
