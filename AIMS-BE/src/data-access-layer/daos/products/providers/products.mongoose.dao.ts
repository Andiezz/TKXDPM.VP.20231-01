import { ObjectId } from 'mongodb'
import { IProduct } from '../interfaces/product.interface'
import { CreateProductDto } from '../../../../dtos/products.dto'
import { BadRequestError } from '../../../../errors'
import { ProductsDao } from '../interfaces/products.dao'
import { ProductModel } from '../schemas/product.model'
import { Model } from 'mongoose'
import { IBook } from '../interfaces/book-model.dto'
import { BookModel } from '../schemas/book.model'

export class ProductsMongooseDao implements ProductsDao {
    constructor(
        private productModel: Model<IProduct> = ProductModel.getInstance()
    ) {}

    public async create(createProductDto: CreateProductDto): Promise<boolean> {
        await this.productModel.create(createProductDto)
        return true
    }

    public async findById(id: string): Promise<IProduct | null> {
        const productDoc = await this.productModel.findById(id)
        if (!productDoc) {
            return null
        }

        const { _id, ...result } = productDoc.toObject()
        result.id = _id
        return result
    }

    public async update(
        id: string,
        updateProductDto: CreateProductDto
    ): Promise<boolean> {
        const productDoc = await this.productModel.findById(id)
        if (!productDoc) {
            throw new BadRequestError('Product is not existed')
        }

        await this.productModel.findByIdAndUpdate(
            new ObjectId(id),
            updateProductDto
        )

        return true
    }

    public async delete(id: string): Promise<boolean> {
        const productDoc = await this.productModel.findById(id)
        if (!productDoc) {
            throw new BadRequestError('Product is not existed')
        }

        await this.productModel.findByIdAndDelete(new ObjectId(id))

        return true
    }

    public async isBarCodeExist(barCode: string): Promise<boolean> {
        const isBarCodeExist = await this.productModel.findOne({
            barcode: barCode
        });
        if (isBarCodeExist) {
            return false;
        }
        return true;
    }
}
