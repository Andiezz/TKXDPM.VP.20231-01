import { UpdateCartDto } from '../../../../dtos/cart.dto'
import { ICart } from './cart.interface'

export interface CartDao {
    findById(id: string): Promise<ICart | null>
    // create(createCartDto: IOrder): Promise<boolean>

    getCartDetail(userId: string): Promise<ICart | null>

    updateInfo(cartId: string, updateCartInfoDto: UpdateCartDto): Promise<ICart>
    seedCart(userId: string): Promise<void>
    // get cart id theo user
    // theem useid
    resetCart(cartId: string): Promise<void>
}
