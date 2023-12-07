import { CreateCartProductDto } from '../../../../dtos/cart-product.dto'
import { ICartProduct } from './cart-product.interface'

export interface CartProductDao {
    findById(id: string): Promise<ICartProduct | null>
    findAll(): Promise<ICartProduct[] | null>
    create(createCartProductDto: CreateCartProductDto): Promise<boolean>
    update(id: string, updateCartProductDto: CreateCartProductDto): Promise<boolean>
    delete(id: string): Promise<boolean>
}
