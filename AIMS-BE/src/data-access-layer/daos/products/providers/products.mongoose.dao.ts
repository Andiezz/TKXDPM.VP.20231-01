import { ObjectId } from 'mongodb'
import { IProduct } from '../interfaces/product.interface'
import {
    CreateProductDto,
    QueryProductDto,
} from '../../../../dtos/products.dto'
import { BadRequestError } from '../../../../errors'
import { ProductsDao } from '../interfaces/products.dao'
import { Model } from 'mongoose'
import { IBook } from '../interfaces/book.interface'
import { calculateSkip } from '../../../../utils/calculate'

export class ProductsMongooseDao implements ProductsDao {
    private productModel: Model<IProduct>
    constructor(productModel: Model<any>) {
        this.productModel = productModel
    }

    public async create(createProductDto: CreateProductDto): Promise<boolean> {
        await this.productModel.create(createProductDto)
        return true
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

    public async findById(id: string): Promise<IProduct | null> {
        const productDoc = await this.productModel.findById(id)
        if (!productDoc) {
            return null
        }

        const { _id, ...result } = productDoc.toObject()
        result.id = _id
        return result
    }

    public async findAll(query: QueryProductDto): Promise<IProduct[]> {
        const { keyword, limit, page, sortBy, sortOrder } = query
        limit 
        const skip = calculateSkip(page, limit);

        const matchFilters: any = {}
        if (keyword) {
            matchFilters['$or'] = [
                { id: { $regex: keyword, $options: 'i' } },
                { title: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } },
            ]
        }

        const results = await this.productModel.aggregate([
            {
                $set: {
                    id: {
                        $toString: '$_id',
                    },
                },
            },
            {
                $match: matchFilters,
            },
            {
                $facet: {
                    paginatedResults: [{ $skip: skip }, { $limit: limit }],
                    totalCount: [{ $count: 'count' }],
                },
            },
            {
                $set: {
                    page,
                    limit,
                    total: { $first: '$totalCount.count' },
                    current: { $size: '$paginatedResults' },
                },
            },
            {
                $unset: ['totalCount'],
            },
        ])
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
            barcode: barCode,
        })
        if (isBarCodeExist) {
            return false
        }
        return true
    }
}
