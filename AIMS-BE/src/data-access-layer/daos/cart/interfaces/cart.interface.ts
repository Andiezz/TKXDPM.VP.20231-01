export interface ICart {
    id: number | ObjectId | string
    userId: ObjectId | string
    totalPrice: number
    totalPriceVat: number
}
