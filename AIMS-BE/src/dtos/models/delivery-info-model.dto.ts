import { ObjectId } from '../../utils/types'

export interface DeliveryInfoModelDto {
    id: number | ObjectId
    name: string
    email: string
    phone: string
    address: string
    province: string
    instructions: string
}
