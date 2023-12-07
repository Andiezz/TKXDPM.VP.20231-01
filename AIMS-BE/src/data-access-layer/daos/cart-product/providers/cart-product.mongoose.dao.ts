import mongoose, { Schema, model } from 'mongoose'
import { ObjectId } from 'mongodb'
import { BadRequestError } from '../../../../errors'
import { CartProductDao } from '../interfaces/cart-product.dao'
import { CreateCartProductDto } from '../../../../dtos/cart-product.dto'
import { Document } from 'mongodb'
import { ICartProduct } from '../interfaces/cart-product.interface'

export class CartProductMongooseDao implements CartProductDao {
    
    constructor(private cartProductModel: Document = cartProductModel.getInstance()) {}



    public async findAll(): Promise<ICartProduct[] | null> {
        throw new Error('Method not implemented.')
    }

    public async create(createCartProductDto: CreateCartProductDto): Promise<boolean> {
        await this.cartProductModel.create(createCartProductDto)
        return true
    }

    public async update(id: string, updateCartProductDto: CreateCartProductDto): Promise<boolean> {
        const productDoc = await this.cartProductModel.findById(id)
        if (!productDoc) {
            throw new BadRequestError('Cart-Product is not existed')
        }

        await this.cartProductModel.findByIdAndUpdate(new ObjectId(id), updateCartProductDto)

        return true
    }

    public async delete(id: string): Promise<boolean> {
        const productDoc = await this.cartProductModel.findById(id)
        if (!productDoc) {
            throw new BadRequestError('Cart-Product is not existed')
        }

      await this.cartProductModel.findByIdAndDelete(new ObjectId(id));

      return true;
    }

    public async findById(id: string): Promise<ICartProduct | null> {
        const cartProductDoc = await this.cartProductModel.findById(id)
        if (!cartProductDoc) {
            return null
        }

        const { _id, ...result } = cartProductDoc.toObject()
        result.id = _id
        return result
    }
}
