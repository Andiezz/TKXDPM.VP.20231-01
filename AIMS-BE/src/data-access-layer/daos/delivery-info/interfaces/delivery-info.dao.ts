import { CreateDeliveryInfoDto } from "../../../../dtos/delivery-info.dto"
import { IDeliveryInfo } from "./delivery-info.interface"


export interface DeliveryInfoDao {
    findById(id: string): Promise<IDeliveryInfo | null>
    create(createDeliveryInfotDto: CreateDeliveryInfoDto): Promise<IDeliveryInfo>
    updateInfo(id: string, updateDeliveryInfoDto: CreateDeliveryInfoDto): Promise<IDeliveryInfo>
    getLatestDeliveryInfoId():Promise<String| null>

}
