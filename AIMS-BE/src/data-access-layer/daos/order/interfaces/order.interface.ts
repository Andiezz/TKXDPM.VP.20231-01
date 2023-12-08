export interface IOrder {
    id: number | ObjectId | string
    totalPrice: number 
    totalPriceVAT: number 
    status: number
}