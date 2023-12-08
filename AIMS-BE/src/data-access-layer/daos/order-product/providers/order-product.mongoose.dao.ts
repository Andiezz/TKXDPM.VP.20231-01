import { ObjectId } from 'mongodb'
import { BadRequestError } from '../../../../errors'
import mongoose, { Schema, model } from 'mongoose'
import { Document } from 'mongodb'
import { CreateOrderProductDto } from '../../../../dtos/order-product.dto'
import { OrderProductDao } from '../interface/order-product.dao'
import { IOrderProduct } from '../interface/order-product.interface'
import { OrderProductModel } from '../schemas/order-product.model'

export class OrderProductMongooseDao implements OrderProductDao {
    
    constructor(private orderProductModel: Document = OrderProductModel.getInstance()){}


    public async findAll(): Promise<IOrderProduct[] | null> {
        throw new Error('Method not implemented.')
    }

    public async create(createOrderProductDto: CreateOrderProductDto): Promise<boolean> {
        await this.orderProductModel.create(createOrderProductDto)
        return true
    }

    public async update(id: string, updateOrderProductDto: CreateOrderProductDto): Promise<boolean> {
        const productDoc = await this.orderProductModel.findById(id)
        if (!productDoc) {
            throw new BadRequestError('Cart-Product is not existed')
        }

        await this.orderProductModel.findByIdAndUpdate(new ObjectId(id), updateOrderProductDto)

        return true
    }

    public async delete(id: string): Promise<boolean> {
        const productDoc = await this.orderProductModel.findById(id)
        if (!productDoc) {
            throw new BadRequestError('Cart-Product is not existed')
        }

      await this.orderProductModel.findByIdAndDelete(new ObjectId(id));

      return true;
    }

    public async findById(id: string): Promise<IOrderProduct | null> {
        const OrderProductDoc = await this.orderProductModel.findById(id)
        if (!OrderProductDoc) {
            return null
        }

        const { _id, ...result } = OrderProductDoc.toObject()
        result.id = _id
        return result
    }
}
