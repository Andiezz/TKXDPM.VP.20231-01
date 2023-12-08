import { IOrderProduct } from '../data-access-layer/daos/order-product/interfaces/order-product.interface'

export type CreateOrderProductDto = Omit<IOrderProduct, 'id'>
