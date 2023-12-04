import { ProductDimension } from '../../daos/products/interfaces/products.interfaces'
import { ObjectId } from '../../utils/types'

export interface ProductModelDto {
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
