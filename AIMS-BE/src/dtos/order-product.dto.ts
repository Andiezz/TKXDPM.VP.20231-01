import { IOrderProduct } from '../data-access-layer/daos/order-product/interface/order-product.interface'

export type CreateOrderProductDto = Omit<IOrderProduct, 'id'>
export type CreateOrderFromCart = Pick<IOrderProduct, 'productId' | 'quantity'>
