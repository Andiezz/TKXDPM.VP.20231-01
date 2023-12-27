import { ORDER_STATUS } from '../../../../configs/constants'
import { CreateOrderDto } from '../../../../dtos/order.dto'
import { IOrder } from './order.interface'

export interface OrderDao {
    findById(id: string | ObjectId): Promise<IOrder | null>
    create(createOrderDto: CreateOrderDto): Promise<IOrder>
    getLatestOrderId(): Promise<String>
    updateStatus(id: string | ObjectId, status: number): Promise<IOrder>
    updateOrder(
        id: string | ObjectId,
        updateOrderDto: CreateOrderDto
    ): Promise<IOrder | null>
    findAll(): Promise<IOrder[]>
}
