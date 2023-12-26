export interface IDeliveryInfo {
    id: number | ObjectId | string
    name: string
    email: string
    phone: string
    address: string
    province: string
    district: string
    instructions: string
    time: Date
    deliveryMethod: string
}
