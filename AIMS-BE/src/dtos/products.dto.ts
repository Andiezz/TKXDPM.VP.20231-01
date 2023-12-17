import { IBook } from '../data-access-layer/daos/products/interfaces/book.interface'
import { IProduct } from '../data-access-layer/daos/products/interfaces/product.interface'
import { IPaginationDto } from './pagination.dto'

export type CreateProductDto = Omit<IProduct | IBook, 'id'>
export type QueryProductDto = IPaginationDto & { keyword: string }
