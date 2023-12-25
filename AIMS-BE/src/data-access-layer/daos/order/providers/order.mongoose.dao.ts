import { ObjectId } from 'mongodb'
import { BadRequestError } from '../../../../errors'
import mongoose, { Schema, model } from 'mongoose'
import { Document } from 'mongodb'
import { OrderDao } from '../interfaces/order.dao'
import { OrderModel } from '../schemas/order.model'
import { IOrder } from '../interfaces/order.interface'
import { CreateOrderDto } from '../../../../dtos/order.dto'
import { ORDER_STATUS } from '../../../../configs/constants'

export class OrderMongooseDao implements OrderDao {
    constructor(private orderModel: Document = OrderModel.getInstance()) {}
    public async findById(id: string): Promise<IOrder | null> {
        const OrderDoc = await this.orderModel.findById(id)
        if (!OrderDoc) {
            return null
        }

        const { _id, ...result } = OrderDoc.toObject()
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
    public async updateOrder(
        id: string,
        updateOrderDto: CreateOrderDto
    ): Promise<IOrder> {
        const orderDoc = await this.orderModel.findById(id)
        if (!orderDoc) {
            throw new BadRequestError('Order is not existed')
        }

        const orderDoc1 = await this.orderModel.findByIdAndUpdate(
            new ObjectId(id),
            updateOrderDto
        )

        const { _id, ...result } = orderDoc1.toObject()
        result.id = _id

        return result
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
