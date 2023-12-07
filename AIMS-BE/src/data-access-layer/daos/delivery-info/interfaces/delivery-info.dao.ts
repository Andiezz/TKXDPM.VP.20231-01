import { CreateDeliveryInfoDto } from "../../../../dtos/delivery-info.dto"
import { IDeliveryInfo } from "./delivery-info.interface"

export interface DeliveryInfoDao {
    findById(id: string): Promise<IDeliveryInfo | null>
    create(createCartProductDto: CreateDeliveryInfoDto): Promise<boolean>
    update(id: string, updateCartProductDto: CreateDeliveryInfoDto): Promise<boolean>
    // checkRushAdress(id: string)

}
