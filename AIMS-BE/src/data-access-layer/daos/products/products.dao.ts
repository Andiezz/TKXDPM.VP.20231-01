import { ProductModelDto } from '../../../dtos/models/product-model.dto'
import { CreateProductDto } from '../../../dtos/products.dto'

export interface ProductsDao {
    create(createProductDto: CreateProductDto): Promise<boolean>
    findById(id: string): Promise<ProductModelDto | null>
    update(id: string, updateProductDto: CreateProductDto): Promise<boolean>
    delete(id: string): Promise<boolean>
}
