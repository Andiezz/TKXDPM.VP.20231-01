import { IProduct } from './product.interface'

export interface ICd extends IProduct {
    artist: string
    recordLabel: string
    genre: string
    releaseDate: Date
}
