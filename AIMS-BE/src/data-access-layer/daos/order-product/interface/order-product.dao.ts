import { IOrderProduct } from './order-product.interface'

export interface OrderProductDao {
    findById(id: string): Promise<IOrderProduct | null>
    findAll(): Promise<IOrderProduct[] | null>
    create(createCartProductDto: IOrderProduct): Promise<boolean>
    update(id: string, updateCartProductDto: IOrderProduct): Promise<boolean>
    delete(id: string): Promise<boolean>
}
