import { IDeliveryInfo } from "../data-access-layer/daos/delivery-info/interfaces/delivery-info.interface"

export type CreateDeliveryInfoDto = Omit<IDeliveryInfo, 'id'>
