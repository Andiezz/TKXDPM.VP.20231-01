import { IOrder } from "../data-access-layer/daos/order";

export type CreateOrderDto = Omit<IOrder, 'id'>
