import { ObjectId } from "../../utils/types";

export interface OrderProductModelDto {
    productId: number | ObjectId
    orderId: number | ObjectId
    quantity: number
}