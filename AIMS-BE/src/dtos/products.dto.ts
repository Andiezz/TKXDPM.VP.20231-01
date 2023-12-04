import { ProductModelDto } from './models/product-model.dto'

export type CreateProductDto = Omit<ProductModelDto, 'id'>
