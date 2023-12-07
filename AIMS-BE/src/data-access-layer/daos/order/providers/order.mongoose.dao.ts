import { ObjectId } from 'mongodb'
import { BadRequestError } from '../../../../errors'
import mongoose, { Schema, model } from 'mongoose'
import { Document } from 'mongodb'
import { OrderDao } from '../interfaces/order.dao'
import { OrderModel } from '../schemas/order.model'
import { IOrder } from '../interfaces/order.interface'

export class OrderProductMongooseDao implements OrderDao {

    constructor(private orderModel: Document = OrderModel.getInstance()){}
    public async findById(id: string): Promise<IOrder | null> {
        const OrderProductDoc = await this.orderModel.findById(id)
        if (!OrderProductDoc) {
            return null
        }

        const { _id, ...result } = OrderProductDoc.toObject()
        result.id = _id
        return result
    }
}
