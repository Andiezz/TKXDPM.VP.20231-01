import { ObjectId } from '../../utils/types'
import { ProductModelDto } from '../../data-access-layer/daos/products/interfaces/product.interface'

export interface CdModelDto extends ProductModelDto {
    id: number | ObjectId | string
    artist: string
    recordLabel: string
    genre: string
    releaseDate: Date
}
