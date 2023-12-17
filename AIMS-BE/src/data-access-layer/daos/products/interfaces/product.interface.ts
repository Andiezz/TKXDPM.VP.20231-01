import { ProductDimension } from "./product-dimension.interfaces"

export interface IProduct {
    id: number | ObjectId | string
    title: string
    category: string
    price: number
    value: number
    importDate: Date
    quantity: number
    description: string
    productDimensions: ProductDimension
    barcode: string
    kind: string
}
