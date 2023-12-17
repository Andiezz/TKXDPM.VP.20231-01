import { CreateProductDto } from '../../../../dtos/products.dto'
import { IProduct } from './product.interface'

export interface ProductsDao {
    create(createProductDto: CreateProductDto): Promise<boolean>
    update(id: string, updateProductDto: CreateProductDto): Promise<boolean>
    findById(id: string): Promise<IProduct | null>
    findAll(): Promise<IProduct[]>
    delete(id: string): Promise<boolean>
    isBarCodeExist(barCode: string): Promise<boolean>
}
