import { COVER_TYPE } from '../../configs/enums'
import { ObjectId } from '../../utils/types'
import { ProductModelDto } from './product-model.dto'

export interface BookModelDto extends ProductModelDto {
    id: number | ObjectId | string
    author: string
    coverType: COVER_TYPE
    publisher: string
    publicationDate: Date
    pages: number
    language: string
    bookCategory: string
}
