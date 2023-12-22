import { CreateCartProductDto } from '../../../../dtos/cart-product.dto'
import { ICartProduct } from './cart-product.interface'
import { Document } from 'mongodb'
export interface CartProductDao {
    findById(id: string): Promise<ICartProduct | null>
    findAll(): Promise<ICartProduct[] | null>
    create(createCartProductDto: CreateCartProductDto): Promise<boolean>
    update(id: string, updateCartProductDto: CreateCartProductDto): Promise<boolean>
    delete(id: string): Promise<boolean>
    findProductsByCartId(id: string): Promise<Document[]| null>
    deleteAll(): Promise<boolean>
}
