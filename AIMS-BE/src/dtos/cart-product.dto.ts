import { ICartProduct } from "../data-access-layer/daos/cart-product/interfaces/cart-product.interface";

export type CreateCartProductDto = Omit<ICartProduct, 'id'>
