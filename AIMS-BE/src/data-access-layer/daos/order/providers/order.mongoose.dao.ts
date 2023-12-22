import { ObjectId } from 'mongodb'
import { BadRequestError } from '../../../../errors'
import mongoose, { Schema, model } from 'mongoose'
import { Document } from 'mongodb'
import { OrderDao } from '../interfaces/order.dao'
import { OrderModel } from '../schemas/order.model'
import { IOrder } from '../interfaces/order.interface'
import { CreateOrderDto } from '../../../../dtos/order.dto'
import { ORDER_STATUS } from '../../../../configs/enums'

export class OrderMongooseDao implements OrderDao {
    constructor(private orderModel: Document = OrderModel.getInstance()) {}
    public async findById(id: string): Promise<IOrder | null> {
        const OrderProductDoc = await this.orderModel.findById(id)
        if (!OrderProductDoc) {
            return null
        }

        const { _id, ...result } = OrderProductDoc.toObject()
        result.id = _id
        return result
    }
    public async create(createOrderDto: CreateOrderDto): Promise<IOrder> {
        const deliveryInfoDoc = await this.orderModel.create({
            ...createOrderDto,
        })
        const { _id, ...result } = deliveryInfoDoc.toObject()
        result.id = _id
        return result
    }

    public async getLatestOrderId(filter?: Object): Promise<string | null> {
        const deliveryInfoDoc = await this.orderModel
            .findOne({ ...filter })
            .sort({ createdAt: -1 }) // Sắp xếp theo thời gian tạo mới nhất đến cũ nhất

        if (deliveryInfoDoc) {
            const { _id } = deliveryInfoDoc.toObject()
            return _id.toString()
        } else {
            return null // Trả về null nếu không tìm thấy giỏ hàng
        }
    }

    public async updateStatus(
        id: string,
        status: ORDER_STATUS
    ): Promise<IOrder> {
        const orderDoc = await this.orderModel.findByIdAndUpdate(id, {
            status: status,
        })
        const { _id, ...result } = orderDoc.toObject()
        result.id = _id

        return result
    }
}
