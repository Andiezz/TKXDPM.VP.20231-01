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
import multer from 'multer'
import { fileHandler } from '../../middlewares/file-handler.middleware'
import { StorageManage } from '../../subsystems/storage-service/interfaces/storage-manage.interface'
import { RemoteStorageManage } from '../../subsystems/storage-service/providers/remote-storage.provider'
import { DEFAULT_IMAGE_URL } from '../../configs/storage.config'

export class ProductController implements Controller {
    public readonly path = '/products'
    public readonly router = Router()
    public readonly productDaoFactory: ProductDaoFactory
    public readonly productDao: ProductsDao
    public readonly storageManage: StorageManage

    constructor() {
        this.productDaoFactory = new ProductDaoFactory()
        this.productDao = new ProductsMongooseDao(ProductModel.getInstance())
        this.storageManage = new RemoteStorageManage()
        this.initializeRoutes()
    }

    private initializeRoutes() {
        const upload = multer()

        this.router.post(
            `${this.path}`,
            jwtAuthGuard as RequestHandler,
            rolesGuard([USER_ROLE.MANAGER, USER_ROLE.ADMIN]) as RequestHandler,
            upload.single('image'),
            fileHandler,
            tryCatch(this.createProduct)
        )

        this.router.patch(
            `${this.path}/:id`,
            // jwtAuthGuard as RequestHandler,
            rolesGuard([USER_ROLE.ADMIN]) as RequestHandler,
            upload.single('image'),
            fileHandler,
            tryCatch(this.updateProduct)
        )

        this.router.get(
            `${this.path}/:id`,
            // jwtAuthGuard as RequestHandler,
            tryCatch(this.getProduct)
        )

        this.router.get(
            `${this.path}`,
            // jwtAuthGuard as RequestHandler,
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

        if (req.body?.file) {
            const uploadedFile = await this.storageManage.upload(req.body.file)
            createProductDto.image = uploadedFile.path
        } else {
            createProductDto.image = DEFAULT_IMAGE_URL.replace("'", '')
        }

        if (typeof createProductDto.productDimensions === 'string') {
            createProductDto.productDimensions = JSON.parse(
                createProductDto.productDimensions
            )
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

        if (req.body?.file) {
            const uploadedFile = await this.storageManage.upload(req.body.file)
            updateProductDto.image = uploadedFile.path
        } else {
            updateProductDto.image = '<default image url>'
        }

        if (typeof updateProductDto.productDimensions === 'string') {
            updateProductDto.productDimensions = JSON.parse(
                updateProductDto.productDimensions
            )
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
