import { ObjectId } from 'mongodb'
import { BadRequestError } from '../../../../errors'
import { Document } from 'mongodb'
import mongoose, { Schema, model } from 'mongoose'
import { ICart } from '../interfaces/cart.interface'
import { CartDao } from '../interfaces/cart.dao'
import { CartModel } from '../schemas/cart.model'

//Data coupling
export class CartMongooseDao implements CartDao {
    constructor(privateCartModel: Document =CartModel.getInstance()){ }

    findById(id: string): Promise<ICart | null> {
        throw new Error('Method not implemented.')
    }
    // create(createCartDto: IOrder): Promise<boolean> {
    //     throw new Error('Method not implemented.')
    // }
    // public async findById(id: string): Promise<ICart | null> {
    //     const cartDoc = await this.cartModel.findById(id)
    //     if (!cartDoc) {
    //         return null
    //     }

    //     const { _id, ...result } = cartDoc.toObject()
    //     result.id = _id
    //     return result
    // }
}
