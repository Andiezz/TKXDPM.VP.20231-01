import { ICart } from "../data-access-layer/daos/cart/interfaces/cart.interface";

export type UpdateCartDto = Omit<ICart, 'id'>
