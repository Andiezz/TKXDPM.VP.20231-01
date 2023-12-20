import { CreateProductDto, QueryProductDto } from '../../../../dtos/products.dto'
import { IProduct } from './product.interface'

export interface ProductsDao {
    create(createProductDto: CreateProductDto): Promise<ObjectId>
    update(id: string, updateProductDto: CreateProductDto): Promise<boolean>
    findById(id: string): Promise<IProduct | null>
    findAll(query: QueryProductDto): Promise<IProduct[]>
    delete(id: string): Promise<boolean>
    isBarCodeExist(barCode: string, id?: string): Promise<boolean>
}
