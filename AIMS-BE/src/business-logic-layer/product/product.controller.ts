import { Request, Response, RequestHandler, Router } from 'express'
import Controller from '../../common/controller.interface'
import { ProductsDao } from '../../data-access-layer/daos/products/interfaces/products.dao.interface'
import { ProductsMongooseDao } from '../../data-access-layer/daos/products/providers/products.mongoose.dao'
import { jwtAuthGuard, rolesGuard } from '../../middlewares/auth.middleware'
import { USER_ROLE } from '../../configs/enums'
import { tryCatch } from '../../middlewares/error.middleware'
import {
    CreateProductDto,
    QueryProductDto,
    UpdateProductDto,
} from '../../dtos/products.dto'
import { BadRequestError } from '../../errors'
import { BaseResponse } from '../../common/base-response'
import ProductDaoFactory from '../../data-access-layer/daos/products/product.dao.factory'
import { ProductModel } from '../../data-access-layer/daos/products/schemas/product.model'

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
            `${this.path}`,
            jwtAuthGuard as RequestHandler,
            rolesGuard([USER_ROLE.ADMIN]) as RequestHandler,
            tryCatch(this.createProduct)
        )

        this.router.patch(
            `${this.path}/:id`,
            jwtAuthGuard as RequestHandler,
            rolesGuard([USER_ROLE.ADMIN]) as RequestHandler,
            tryCatch(this.updateProduct)
        )

        this.router.get(
            `${this.path}/:id`,
            jwtAuthGuard as RequestHandler,
            rolesGuard([USER_ROLE.ADMIN]) as RequestHandler,
            tryCatch(this.getProduct)
        )

        this.router.get(
            `${this.path}`,
            jwtAuthGuard as RequestHandler,
            rolesGuard([USER_ROLE.ADMIN]) as RequestHandler,
            tryCatch(this.getProducts)
        )

        this.router.delete(
            `${this.path}/:id`,
            jwtAuthGuard as RequestHandler,
            rolesGuard([USER_ROLE.ADMIN]) as RequestHandler,
            tryCatch(this.deleteProduct)
        )
    }

    private createProduct = async (
        req: Request,
        res: Response
    ): Promise<Response> => {
        const createProductDto = <CreateProductDto>req.body
        const { kind } = req.body
        const productDao = this.productDaoFactory.getInstance(kind)

        const isBarCodeExist = await productDao.isBarCodeExist(
            createProductDto.barcode
        )
        if (isBarCodeExist) {
            throw new BadRequestError('Bar code has already existed')
        }

        await productDao.create(createProductDto)

        return res.json(new BaseResponse().ok('Create product successfully'))
    }

    private updateProduct = async (
        req: Request,
        res: Response
    ): Promise<Response | void> => {
        const updateProductDto = <UpdateProductDto>req.body
        const { id } = req.params
        const { kind } = req.body
        const productDao = this.productDaoFactory.getInstance(kind)

        const isBarCodeExist = await productDao.isBarCodeExist(
            updateProductDto.barcode,
            id
        )
        if (isBarCodeExist) {
            throw new BadRequestError('Bar code has already existed')
        }

        await productDao.update(id, updateProductDto)

        return res.json(new BaseResponse().ok('Update product successfully'))
    }

    private getProduct = async (
        req: Request,
        res: Response
    ): Promise<Response> => {
        const { id } = req.params

        const product = await this.productDao.findById(id)
        if (!product) {
            new BaseResponse().fail('Product not found')
        }

        return res.json(
            new BaseResponse().ok('Get product successfully', product)
        )
    }

    private getProducts = async (
        req: Request,
        res: Response
    ): Promise<Response> => {
        const query = <QueryProductDto>req.query
        const products = await this.productDao.findAll(query)
        if (products.length === 0) {
            new BaseResponse().fail('No product found')
        }

        return res.json(
            new BaseResponse().ok('Get products successfully', products)
        )
    }

    private deleteProduct = async (
        req: Request,
        res: Response
    ): Promise<Response> => {
        const { id } = req.params

        const product = await this.productDao.findById(id)
        if (!product) {
            new BaseResponse().fail('Product not found')
        }

        await this.productDao.delete(id)

        return res.json(new BaseResponse().ok('Delete product successfully'))
    }
}
