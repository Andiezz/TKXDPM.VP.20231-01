import { ICart } from "../data-access-layer/daos/cart/interfaces/cart.interface.dto"

export type CreateCartProductDto = Omit<ICart, 'id'>
