import { Request, RequestHandler, Response, Router } from 'express'
import Controller from '../../common/controller.interface'
import { CdTrackRepository } from '../../data-access-layer/repositories/cd-track/interfaces/cd-track.repository.interface'
import { CdTrackMongooseRepository } from '../../data-access-layer/repositories/cd-track/providers/cd-track.mongoose.repository'
import { CreateCdTrackDto } from '../../dtos/cd-track.dto'
import { ProductsDao } from '../../data-access-layer/daos/products/interfaces/products.dao.interface'
import ProductDaoFactory from '../../data-access-layer/daos/products/product.dao.factory'
import { KIND, USER_ROLE } from '../../configs/enums'
import { BadRequestError } from '../../errors'
import { BaseResponse } from '../../common/base-response'
import { jwtAuthGuard, rolesGuard } from '../../middlewares/auth.middleware'
import { tryCatch } from '../../middlewares/error.middleware'

export class CdTrackController implements Controller {
    public readonly path = '/cd-track'
    public readonly router = Router()
    public readonly cdTrackRepository: CdTrackRepository
    public readonly cdDao: ProductsDao

    constructor() {
        this.cdTrackRepository = new CdTrackMongooseRepository()
        this.cdDao = new ProductDaoFactory().getInstance(KIND.CD)
        this.initializeRoutes()
    }

    private initializeRoutes() {
        this.router.post(
            `${this.path}`,
            jwtAuthGuard as RequestHandler,
            rolesGuard([USER_ROLE.ADMIN]) as RequestHandler,
            tryCatch(this.createCdTrack)
        )

        this.router.delete(
            `${this.path}/:id`,
            jwtAuthGuard as RequestHandler,
            rolesGuard([USER_ROLE.ADMIN]) as RequestHandler,
            tryCatch(this.delete)
        )
    }

    private createCdTrack = async (
        req: Request,
        res: Response
    ): Promise<Response> => {
        const createCdTrack = <CreateCdTrackDto>req.body

        const isBarCodeExist = await this.cdDao.isBarCodeExist(
            createCdTrack.cd.barcode
        )
        if (isBarCodeExist) {
            throw new BadRequestError('Bar code has already existed')
        }

        await this.cdTrackRepository.create(createCdTrack)

        return res.json(
            new BaseResponse().ok('Create cd and related tracks successfully')
        )
    }

    private delete = async (req: Request, res: Response): Promise<Response> => {
        const { id } = req.params

        const cd = await this.cdDao.findById(id)
        if (!cd) {
            new BaseResponse().fail('Cd not found')
        }

        await this.cdTrackRepository.delete(id)

        return res.json(
            new BaseResponse().ok('Delete cd and related tracks successfully')
        )
    }
}
