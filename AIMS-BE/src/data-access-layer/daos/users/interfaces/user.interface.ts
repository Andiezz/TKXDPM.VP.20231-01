import { ObjectId } from '../../../../utils/types'

export interface IUser {
    id: number | ObjectId | string
    email: string
    password: string
    role: string
    status: number
    name: string
    phone: string
}
