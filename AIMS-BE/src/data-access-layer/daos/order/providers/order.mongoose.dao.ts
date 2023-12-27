import { Document, ObjectId } from 'mongodb'
import { isValidObjectId } from 'mongoose'
import { CreateOrderDto } from '../../../../dtos/order.dto'
import { BadRequestError } from '../../../../errors'
import { OrderDao } from '../interfaces/order.dao'
import { IOrder } from '../interfaces/order.interface'
import { OrderModel } from '../schemas/order.model'

export class OrderMongooseDao implements OrderDao {
    constructor(private orderModel: Document = OrderModel.getInstance()) {}
    public async findById(id: string): Promise<IOrder | null> {
        if (!isValidObjectId(id)) {
            return null
        }

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

    public async getLatestOrderId(filter?: Object): Promise<string> {
        const deliveryInfoDoc = await this.orderModel
            .findOne({ ...filter })
            .sort({ createdAt: -1 }) // Sắp xếp theo thời gian tạo mới nhất đến cũ nhất
        const { _id } = deliveryInfoDoc.toObject()
        return _id.toString()
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
    public async updateStatus(id: string, status: number): Promise<IOrder> {
        const orderDoc = await this.orderModel.findByIdAndUpdate(
            id,
            {
                status: status,
            },
            { new: true }
        )
        const { _id, ...result } = orderDoc.toObject()
        result.id = _id

        return result
    }
    public async findAll(): Promise<IOrder[]> {
        const orderDocs = await this.orderModel.find({})
        return orderDocs.map((doc: Document) => {
            const { _id, ...result } = doc.toObject()
            result.id = _id
            return result
        })
    }
}
