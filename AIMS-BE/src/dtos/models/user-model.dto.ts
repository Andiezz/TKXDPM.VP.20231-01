import { ObjectId } from "../../utils/types"

export interface UserModelDto {
    id: number | ObjectId | string
    email: string
    password: string
    role: string
    status: number
    name: string
    phone: string
    refreshToken: string
}
