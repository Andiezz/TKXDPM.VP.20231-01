import { ObjectId } from "../../utils/types"

export interface CartModelDto {
    id: number | ObjectId | string
    totalPrice: number
    totalPriceVat: number
}
