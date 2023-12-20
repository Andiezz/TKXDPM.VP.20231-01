import { CreateOrderDto } from "../../../../dtos/order.dto";
import { IOrder } from "./order.interface";

export interface OrderDao {
    findById(id: string): Promise<IOrder | null>
    create(createOrderDto: CreateOrderDto): Promise<IOrder>
    getLatestOrderId():Promise<String| null>
}
