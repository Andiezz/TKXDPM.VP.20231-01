import { COVER_TYPE } from '../../../../configs/enums'
import { IProduct } from './product.interface'

export interface IBook extends IProduct {
    author: string
    coverType: COVER_TYPE
    publisher: string
    publicationDate: Date
    pages: number
    language: string
    bookCategory: string
}
