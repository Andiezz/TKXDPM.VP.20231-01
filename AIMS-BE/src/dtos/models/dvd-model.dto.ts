import { ObjectId } from '../../utils/types'
import { ProductModelDto } from './product-model.dto'

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
