import { ObjectId } from "../../utils/types";

export interface Invoice {
    id: number | ObjectId
    totalAmount: number
    orderId: number | ObjectId
}