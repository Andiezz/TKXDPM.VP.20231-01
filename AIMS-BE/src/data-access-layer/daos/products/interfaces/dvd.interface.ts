import { IProduct } from './product.interface'

export interface IDvd extends IProduct {
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
