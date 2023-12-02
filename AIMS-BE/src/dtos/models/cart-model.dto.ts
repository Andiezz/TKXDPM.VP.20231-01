import { ObjectId } from "../../utils/types"

export interface CartModelDto {
    id: number | ObjectId
    totalPrice: number
    totalPriceVat: number
}
