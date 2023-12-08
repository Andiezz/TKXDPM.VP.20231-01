
export interface IOrderProduct {
    id: number | ObjectId | string
    productId: number | ObjectId | string
    orderId: number | ObjectId | string
    quantity: number
}