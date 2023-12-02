import { ObjectId } from "../../utils/types";

export interface CartProductModelDto {
    productId: number | ObjectId
    cartId: number | ObjectId
    quantity: number
}