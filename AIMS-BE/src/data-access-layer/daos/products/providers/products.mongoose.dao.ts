import { ObjectId } from 'mongodb'
import { ProductModelDto } from '../../../../dtos/models/product-model.dto'
import { CreateProductDto } from '../../../../dtos/products.dto'
import { BadRequestError } from '../../../../errors'
import { ProductsDao } from '../products.dao'
import ProductModel from '../schemas/products.mongoose.schema'

export class ProductsMongooseDao implements ProductsDao {
    public async create(createProductDto: CreateProductDto): Promise<boolean> {
        await ProductModel.create(createProductDto)
        return true
    }

    public async findById(id: string): Promise<ProductModelDto | null> {
        const productDoc = await ProductModel.findById(id)
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
        const productDoc = await ProductModel.findById(id)
        if (!productDoc) {
            throw new BadRequestError('Product is not existed')
        }

        await ProductModel.findByIdAndUpdate(new ObjectId(id), updateProductDto)

        return true
    }

    public async delete(id: string): Promise<boolean> {
      const productDoc = await ProductModel.findById(id)
        if (!productDoc) {
            throw new BadRequestError('Product is not existed')
        }

      await ProductModel.findByIdAndDelete(new ObjectId(id));

      return true;
    }
}
