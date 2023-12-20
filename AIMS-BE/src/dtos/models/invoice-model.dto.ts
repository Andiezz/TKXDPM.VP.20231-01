
export interface Invoice {
    id:number | ObjectId | string
    totalAmount: number
    orderId: number | ObjectId | string
}