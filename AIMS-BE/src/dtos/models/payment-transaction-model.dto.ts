import { ObjectId } from "../../utils/types";

export interface PaymentTransactionModelDto {
    id: number | ObjectId
    content: string
    method: string
    cardId: number | ObjectId
    invoiceId: number | ObjectId
}