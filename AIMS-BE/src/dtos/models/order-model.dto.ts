import { ObjectId } from "../../utils/types"

export interface OrderModelDto {
    id: number | ObjectId
    totalPrice: number
    totalPriceVat: number
    shippingFee: number
    deliveryInfoId: number | ObjectId
}
