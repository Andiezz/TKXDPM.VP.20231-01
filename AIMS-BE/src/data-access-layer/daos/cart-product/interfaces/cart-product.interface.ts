
export interface ICartProduct {
    id: number | ObjectId | string
    productId: number | ObjectId | string
    cartId: number | ObjectId | string
    quantity: number
}