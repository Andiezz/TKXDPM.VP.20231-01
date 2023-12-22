import { ObjectId } from 'mongodb'
import { IProduct } from '../interfaces/product.interface'
import {
    CreateProductDto,
    QueryProductDto,
} from '../../../../dtos/products.dto'
import { BadRequestError } from '../../../../errors'
import { ProductsDao } from '../interfaces/products.dao.interface'
import { Model } from 'mongoose'
import { calculateSkip } from '../../../../utils/calculate'
import {
    PAGINATION_DEFAULT,
    PAGINATION_SORT,
} from '../../../../configs/constants'

export class ProductsMongooseDao implements ProductsDao {
    private productModel: Model<IProduct>
    constructor(productModel: Model<any>) {
        this.productModel = productModel
    }

    public async create(createProductDto: CreateProductDto): Promise<ObjectId> {
        const result = await this.productModel.create(createProductDto)
        return result._id
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
        let { keyword, limit, page, sortBy, sortOrder } = query

        //set default values
        !limit && (limit = PAGINATION_DEFAULT.LIMIT)
        !page && (page = PAGINATION_DEFAULT.PAGE)
        !sortBy && (sortBy = PAGINATION_SORT.SORT_BY)
        !sortOrder && (sortOrder = PAGINATION_SORT.ASC)

        const skip = calculateSkip(page, limit)

        const matchFilters: any = {}
        if (keyword) {
            matchFilters['$or'] = [
                { id: { $regex: keyword, $options: 'i' } },
                { title: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } },
            ]
        }

        const results = (await this.productModel.aggregate([
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
                    paginatedResults: [
                        { $skip: skip },
                        { $limit: limit as number },
                    ],
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
        ])) as IProduct[]

        return results
    }

    public async delete(id: string): Promise<boolean> {
        const productDoc = await this.productModel.findById(id)
        if (!productDoc) {
            throw new BadRequestError('Product is not existed')
        }

        await this.productModel.findByIdAndDelete(new ObjectId(id))

        return true
    }

    public async isBarCodeExist(
        barCode: string,
        id?: string
    ): Promise<boolean> {
        const isBarCodeExist = await this.productModel.findOne({
            $and: [
                {
                    barcode: { $eq: barCode },
                },
                {
                    _id: { $ne: new ObjectId(id) },
                },
            ],
        })
        if (isBarCodeExist) {
            return true
        }
        return false
    }

    public async findMany(ids: string[]): Promise<IProduct[]> {
        const productObjectIds = ids.map((id) => new ObjectId(id))
        const products = await this.productModel.find({
            _id: { $in: productObjectIds },
        })
        return products
    }
}
