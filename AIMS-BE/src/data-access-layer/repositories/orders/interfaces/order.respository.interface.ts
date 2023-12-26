import { CreateOrderFromCart } from '../../../../dtos/order-product.dto'
import { CreateOrderDto } from '../../../../dtos/order.dto'

export interface orderRepository {
    createOrderFromCart(
        listProducts: CreateOrderFromCart[],
        createOrderDto: CreateOrderDto
    ): Promise<String>
    getAllOrderInfo(): Promise<Document>
}
