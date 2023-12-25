import { CreateDeliveryInfoDto } from '../../../../dtos/delivery-info.dto'
import { DeliveryInfoDao } from '../interfaces/delivery-info.dao'
import { IDeliveryInfo } from '../interfaces/delivery-info.interface'
import { DeliveryInfoModel } from '../schemas/delivery-info.model'
import { Document, ObjectId } from 'mongodb'
import { CreateUserDto, UpdateUserInfoDto } from '../../../../dtos/users.dto'
import { isValidObjectId } from 'mongoose'
import { BadRequestError } from '../../../../errors'

export class DeliveryInfoMongooseDao implements DeliveryInfoDao {
    constructor(
        private deliveryInfoModel: Document = DeliveryInfoModel.getInstance()
    ) {}

    public async findById(id: string): Promise<IDeliveryInfo | null> {
        if (!isValidObjectId(id)) {
            return null
        }

        const deliveryInfoDoc = await this.deliveryInfoModel.findById(id)
        if (!deliveryInfoDoc) {
            return null
        }

        const { _id, ...result } = deliveryInfoDoc.toObject()
        result.id = _id
        return result
    }

    public async create(
        createDeliveryInfoDto: CreateDeliveryInfoDto
    ): Promise<IDeliveryInfo> {
        const deliveryInfoDoc = await this.deliveryInfoModel.create({
            ...createDeliveryInfoDto,
        })
        const { _id, ...result } = deliveryInfoDoc.toObject()
        result.id = _id
        return result
    }

    public async updateInfo(
        deliveryInfoId: string,
        updateDeliveryInfoDto: CreateDeliveryInfoDto
    ): Promise<IDeliveryInfo> {
        const deliveryInfoDoc =
            await this.deliveryInfoModel.findById(deliveryInfoId)
        if (!deliveryInfoDoc) {
            throw new BadRequestError('deliveryInfo is not existed')
        }
        const deliveryInfoNewDoc =
            await this.deliveryInfoModel.findByIdAndUpdate(deliveryInfoId, {
                ...updateDeliveryInfoDto,
            })
        const { _id, ...result } = deliveryInfoNewDoc.toObject()
        result.id = _id

        return result
    }

    public async getLatestDeliveryInfoId(
        filter?: Object
    ): Promise<string | null> {
        const deliveryInfoDoc = await this.deliveryInfoModel
            .findOne({ ...filter })
            .sort({ createdAt: -1 }) // Sắp xếp theo thời gian tạo mới nhất đến cũ nhất

        if (deliveryInfoDoc) {
            const { _id } = deliveryInfoDoc.toObject()
            return _id.toString()
        } else {
            return null // Trả về null nếu không tìm thấy giỏ hàng
        }
    }
}
