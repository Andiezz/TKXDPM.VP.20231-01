import { ObjectId } from '../../utils/types'

export interface DeliveryInfoModelDto {
    id: number | ObjectId | string
    name: string
    email: string
    phone: string
    address: string
    province: string
    instructions: string
}
