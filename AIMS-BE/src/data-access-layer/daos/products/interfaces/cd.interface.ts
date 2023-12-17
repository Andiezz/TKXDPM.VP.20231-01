import { IProduct } from './product.interface'

export interface ICd extends IProduct {
    id: number | ObjectId | string
    artist: string
    recordLabel: string
    genre: string
    releaseDate: Date
}
