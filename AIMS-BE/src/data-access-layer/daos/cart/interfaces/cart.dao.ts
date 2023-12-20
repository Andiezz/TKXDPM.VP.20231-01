import { UpdateCartDto } from '../../../../dtos/cart.dto'
import { ICart } from './cart.interface'


export interface CartDao {
    findById(id: string): Promise<ICart | null>
    // create(createCartDto: IOrder): Promise<boolean>
    // thiếu get id cart
    getLatestCartId():Promise<String| null>
    updateInfo(
        cartId: string,
        updateCartInfoDto: UpdateCartDto
    ): Promise<ICart>
    seedCart(): Promise<void>
    resetCart(cartId: string):Promise<void>
}
