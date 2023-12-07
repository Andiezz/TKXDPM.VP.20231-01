import { IOrder } from "./order.interface";

export interface OrderDao {
    findById(id: string): Promise<IOrder | null>
}
