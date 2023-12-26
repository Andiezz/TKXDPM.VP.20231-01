import { ORDER_STATUS } from '../../../../configs/constants'
import { CreateOrderDto } from '../../../../dtos/order.dto'
import { IOrder } from './order.interface'

export interface OrderDao {
    findById(id: string): Promise<IOrder | null>
    create(createOrderDto: CreateOrderDto): Promise<IOrder>
    getLatestOrderId(): Promise<String>
    updateStatus(id: string, status: number): Promise<IOrder>
    updateOrder(
        id: string,
        updateOrderDto: CreateOrderDto
    ): Promise<IOrder | null>
    findAll(): Promise<IOrder[]>
}
