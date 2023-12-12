import { IBook } from '../data-access-layer/daos/products/interfaces/book-model.dto'
import { IProduct } from '../data-access-layer/daos/products/interfaces/product.interface'

export type CreateProductDto = Omit<IBook , 'id'>
