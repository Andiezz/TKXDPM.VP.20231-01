import { ObjectId } from "../../utils/types";

export interface CartProductModelDto {
    id: number | ObjectId | string
    productId: number | ObjectId | string
    cartId: number | ObjectId | string
    quantity: number
}