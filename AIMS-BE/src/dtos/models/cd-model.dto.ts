import { ObjectId } from '../../utils/types'
import { ProductModelDto } from './product-model.dto'

export interface CdModelDto extends ProductModelDto {
    id: number | ObjectId
    artist: string
    recordLabel: string
    genre: string
    releaseDate: Date
}
