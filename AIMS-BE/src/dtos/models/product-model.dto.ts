import { ProductDimension } from '../../configs/interfaces'
import { ObjectId } from '../../utils/types'

export interface ProductModelDto {
    id: number | ObjectId
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
