import { ObjectId } from 'mongodb'
import { BadRequestError } from '../../../../errors'
import { Document } from 'mongodb'
import mongoose, { Schema, isValidObjectId, model } from 'mongoose'
import { ICart } from '../interfaces/cart.interface'
import { CartDao } from '../interfaces/cart.dao'
import { CartModel } from '../schemas/cart.model'
import { UpdateCartDto } from '../../../../dtos/cart.dto'

//Data coupling
export class CartMongooseDao implements CartDao {
    constructor(private cartModel: Document = CartModel.getInstance()) {}

    public async updateInfo(
        cartId: string,
        updateCartInfoDto: UpdateCartDto
    ): Promise<ICart> {
        const userDoc = await this.cartModel.findByIdAndUpdate(cartId, {
            totalPrice: updateCartInfoDto.totalPrice,
            totalPriceVat: updateCartInfoDto.totalPriceVat,
        })
        const { _id, ...result } = userDoc.toObject()
        result.id = _id

        return result
    }

    public async findById(id: string): Promise<ICart | null> {
        if (!isValidObjectId(id)) {
            return null
        }

        const cartDoc = await this.cartModel.findById(id)
        if (!cartDoc) {
            return null
        }

        const { _id, ...result } = cartDoc.toObject()
        result.id = _id
        return result
    }
    public async getLatestCartId(filter?: Object): Promise<string | null> {
        const cartDoc = await this.cartModel
            .findOne({ ...filter })
            .sort({ createdAt: -1 }) // Sắp xếp theo thời gian tạo mới nhất đến cũ nhất

        if (cartDoc) {
            const { _id } = cartDoc.toObject()
            return _id.toString()
        } else {
            return null // Trả về null nếu không tìm thấy giỏ hàng
        }
    }
    public async seedCart(userId: string): Promise<void> {
        try {
            await this.cartModel.create({
                userId: userId,
                totalPrice: 0,
                totalPriceVat: 0,
            })
            console.log('Seeded cart successfully')
        } catch (e) {
            console.error('Seeded cart fail')
        }
    }

    public async getCartDetail(userId: string): Promise<ICart | null> {
        const cartDoc = await this.cartModel.findOne(userId)
        if (!cartDoc) {
            return null
        }

        const { _id, ...result } = cartDoc.toObject()
        result.id = _id
        return result
    }

    public async resetCart(cartId: string): Promise<void> {
        try {
            await this.cartModel.findByIdAndUpdate(cartId, {
                totalPrice: 0,
                totalPriceVat: 0,
            })
            console.log('Reseted cart successfully')
        } catch (e) {
            console.error('Reseted cart fail')
        }
    }
}
