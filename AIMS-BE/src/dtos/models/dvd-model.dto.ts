import { ObjectId } from '../../utils/types'
import { ProductModelDto } from '../../data-access-layer/daos/products/interfaces/product.interface'

export interface DvdModelDto extends ProductModelDto {
    id: number | ObjectId | string
    discType: string
    director: string
    runtime: number
    studio: string
    language: string
    releaseDate: Date
    genre: string
    subtitle: string
}
