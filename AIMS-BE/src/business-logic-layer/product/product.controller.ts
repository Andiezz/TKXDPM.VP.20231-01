import { Request, Response, RequestHandler, Router } from "express";
import Controller from "../../common/controller.interface";
import { ProductsDao } from "../../data-access-layer/daos/products/interfaces/products.dao";
import { ProductsMongooseDao } from "../../data-access-layer/daos/products/providers/products.mongoose.dao";
import { jwtAuthGuard, rolesGuard } from "../../middlewares/auth.middleware";
import { USER_ROLE } from "../../configs/enums";
import { tryCatch } from "../../middlewares/error.middleware";
import { CreateProductDto } from "../../dtos/products.dto";
import { BadRequestError } from "../../errors";
import { BaseResponse } from "../../common/base-response";
import ProductDaoFactory from "../../data-access-layer/daos/products/product.dao.factory";

export class ProductController implements Controller {
    public readonly path = '/products'
    public readonly router = Router()
    public readonly productDaoFactory = new ProductDaoFactory();

    constructor() {
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

    private createProduct = async (req: Request, res: Response): Promise<Response | void> => {
        const createProductDto = <CreateProductDto>req.body
        const { kind } = req.body
        const productDao = this.productDaoFactory.getInstance(kind);

        const isProductNameExist = await productDao.isBarCodeExist(createProductDto.barcode)
        if(!isProductNameExist) {
            throw new BadRequestError('Bar code has already existed')
        }

        await productDao.create(createProductDto)

        return res.json(new BaseResponse().ok('Create product successfully'))
    }
}