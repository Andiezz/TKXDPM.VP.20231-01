import { ORDER_STATUS } from "../configs/constants";
import { IOrder } from "../data-access-layer/daos/order";

export type CreateOrderDto = Omit<IOrder, 'id'>
export class OrderDtoFactory {
    static createCreateOrderDto(totalPrice: number, deliveryInfoId: string, shippingCost: number): CreateOrderDto {
        return {
            totalPrice: totalPrice,
            totalPriceVAT: totalPrice * 0.1,
            deliveryInfoId: deliveryInfoId,
            shippingCost: shippingCost,
            status: ORDER_STATUS.PENDING,
            totalAmount: totalPrice * 1.1 + shippingCost,
        };
    }
}