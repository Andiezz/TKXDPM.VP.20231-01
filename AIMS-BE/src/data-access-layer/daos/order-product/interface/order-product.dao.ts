import { CreateOrderProductDto } from '../../../../dtos/order-product.dto'
import { IOrderProduct } from './order-product.interface'
import { Document } from 'mongodb'
export interface OrderProductDao {
    findById(id: string): Promise<IOrderProduct | null>
    findAll(): Promise<IOrderProduct[] | null>
    create(createOrderProductDto: CreateOrderProductDto): Promise<boolean>
    update(id: string, updateCartProductDto: IOrderProduct): Promise<boolean>
    delete(id: string): Promise<boolean>
    findProductsByOrderId(id: string): Promise<Document[]| null>
}
