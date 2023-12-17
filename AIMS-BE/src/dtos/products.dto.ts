import { IProduct } from '../data-access-layer/daos/products/interfaces/product.interface'
import { IPaginationDto } from './pagination.dto'

export type CreateProductDto = Omit<IProduct, 'id'>
export type UpdateProductDto = Omit<IProduct, 'id'>
export type QueryProductDto = IPaginationDto & { keyword: string }
