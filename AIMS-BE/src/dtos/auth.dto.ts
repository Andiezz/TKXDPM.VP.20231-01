import { IUser } from '../data-access-layer/daos/users/interfaces/user.interface'

export type LoginDto = Pick<IUser, 'email' | 'password'>
