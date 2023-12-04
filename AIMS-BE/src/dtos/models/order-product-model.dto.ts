import { ObjectId } from "../../utils/types";

export interface OrderProductModelDto {
    id: number | ObjectId | string
    productId: number | ObjectId | string
    orderId: number | ObjectId | string
    quantity: number
}