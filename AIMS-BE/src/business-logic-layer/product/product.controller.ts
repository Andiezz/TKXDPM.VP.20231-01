import { Request, Response, RequestHandler, Router } from 'express'
import Controller from '../../common/controller.interface'
import { ProductsDao } from '../../data-access-layer/daos/products/interfaces/products.dao'
import { ProductsMongooseDao } from '../../data-access-layer/daos/products/providers/products.mongoose.dao'
import { jwtAuthGuard, rolesGuard } from '../../middlewares/auth.middleware'
import { USER_ROLE } from '../../configs/enums'
import { tryCatch } from '../../middlewares/error.middleware'
import { CreateProductDto } from '../../dtos/products.dto'
import { BadRequestError } from '../../errors'
import { BaseResponse } from '../../common/base-response'
import ProductDaoFactory from '../../data-access-layer/daos/products/product.dao.factory'
import { ProductModel } from '../../data-access-layer/daos/products/schemas/product.model'
import { IProduct } from '../../data-access-layer/daos/products/interfaces/product.interface'

export class ProductController implements Controller {
    public readonly path = '/products'
    public readonly router = Router()
    public readonly productDaoFactory: ProductDaoFactory
    public readonly productDao: ProductsDao

    constructor() {
        this.productDaoFactory = new ProductDaoFactory()
        this.productDao = new ProductsMongooseDao(ProductModel.getInstance())
        this.initializeRoutes()
    }

    private initializeRoutes() {
        this.router.post(
            `${this.path}/create`,
            jwtAuthGuard as RequestHandler,
            rolesGuard([USER_ROLE.ADMIN]) as RequestHandler,
            tryCatch(this.createProduct)
        )
    }

    private createProduct = async (
        req: Request,
        res: Response
    ): Promise<BaseResponse> => {
        const createProductDto = <CreateProductDto>req.body
        const { kind } = req.body
        const productDao = this.productDaoFactory.getInstance(kind)

        const isProductNameExist = await productDao.isBarCodeExist(
            createProductDto.barcode
        )
        if (!isProductNameExist) {
            throw new BadRequestError('Bar code has already existed')
        }

        await productDao.create(createProductDto)

        return res.json(new BaseResponse().ok('Create product successfully'))
    }

    private getProduct = async (
        req: Request,
        res: Response
    ): Promise<BaseResponse> => {
        const { id } = req.params

        const product = await this.productDao.findById(id)
        if (!product) {
            new BaseResponse().fail('Product not found')
        }

        return res.json(
            new BaseResponse().ok('Get product successfully'),
            product
        )
    }

    
}
