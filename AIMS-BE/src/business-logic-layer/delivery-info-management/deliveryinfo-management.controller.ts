import { Request, RequestHandler, Response, Router } from 'express'
import { BaseResponse } from '../../common/base-response'
import Controller from '../../common/controller.interface'
import { USER_ROLE } from '../../configs/enums'
import { UsersDao, UsersMongooseDao } from '../../data-access-layer/daos/users'
import { CreateUserDto, UpdateUserInfoDto } from '../../dtos/users.dto'
import { BadRequestError } from '../../errors'
import { jwtAuthGuard, rolesGuard } from '../../middlewares/auth.middleware'
import { tryCatch } from '../../middlewares/error.middleware'
import * as validators from '../../middlewares/validators.middleware'
import { compareHash, hashData } from '../../utils/security'
import {
    NotificationService,
    RecipientDto,
} from '../../subsystems/notification-service'
import { DeliveryInfoDao } from '../../data-access-layer/daos/delivery-info/interfaces/delivery-info.dao'
import { MailService } from '../../subsystems/notification-service/providers/mail.service'
import { DeliveryInfoMongooseDao } from '../../data-access-layer/daos/delivery-info/providers/delivery-info.mongoose.dao'
import { CreateDeliveryInfoDto } from '../../dtos/delivery-info.dto'

export class DeliveryInfoManagementController implements Controller {
    public readonly path = '/deliveryInfo'
    public readonly router = Router()
    private deliveryInfoDao: DeliveryInfoDao
    private notificationService: NotificationService
    
    constructor() {
        this.notificationService = MailService.getInstance()
        this.deliveryInfoDao = new DeliveryInfoMongooseDao()
        this.initializeRoutes()
    }

    private initializeRoutes(): void {
        this.router.post(
            `${this.path}/create`,
            tryCatch(this.createDeliveryInfo)
        )
        this.router.patch(
            `${this.path}/:deliveryInfoId`,
            tryCatch(this.updateDeliveryInfo)
        )
    }
    private createDeliveryInfo = async (
        req: Request,
        res: Response
    ): Promise<Response | void> => {
        const createDeliveryInfoDto = <CreateDeliveryInfoDto>req.body
        
        await this.deliveryInfoDao.create(createDeliveryInfoDto)
        return res.json(new BaseResponse().ok('Create new delivery info'))
    }

    private updateDeliveryInfo = async (
        req: Request,
        res: Response
    ): Promise<Response | void> => {
        const { deliveryInfoId } = req.params
        const createDeliveryInfoDto = <CreateDeliveryInfoDto>req.body
        const deliveryInfoDoc = await this.deliveryInfoDao.findById(deliveryInfoId)
        if (!deliveryInfoDoc) {
            throw new BadRequestError('DeliveryInfo not found')
        }
        await this.deliveryInfoDao.updateInfo(deliveryInfoId,createDeliveryInfoDto)
        
        return res.json(new BaseResponse().ok('Create new user account'))
    }
}