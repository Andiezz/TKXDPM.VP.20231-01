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
import { MailService } from '../../subsystems/notification-service/providers/mail.service'
import { OrderRepository } from '../../data-access-layer/repositories/orders/order.respository'

export class OrderManagementController implements Controller {

    public readonly path = '/order'
    public readonly router = Router()
    private notificationService: NotificationService
    private orderRepository:OrderRepository

    constructor() {
        this.notificationService = MailService.getInstance()
        this.orderRepository = new OrderRepository();
        this.initializeRoutes()
    }

    private initializeRoutes(): void {
        this.router.get(
            `${this.path}/create`,
            tryCatch(this.createDeliveryInfo)
        )
        this.router.get(
            `${this.path}/getOrder`,
            tryCatch(this.getOrder)
        )
    }

    private createDeliveryInfo = async (
        req: Request,
        res: Response
    ): Promise<Response | void> => {
    
        await this.orderRepository.createOrderFromCart()
        return res.json(new BaseResponse().ok('Create new Order info'))
    }

    private getOrder = async (  
        req: Request,
        res: Response
        ): Promise<Response | void> => {
        const cartIdObject = await this.orderRepository.getOrderInfo()
        return res.json(
            new BaseResponse().ok('Fetched Order info', {
                Order_info: cartIdObject,
            })
        )
    }
}