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
import { CreateOrderFromCart } from '../../dtos/order-product.dto'
import { OrderDao, OrderMongooseDao } from '../../data-access-layer/daos/order'

export class OrderManagementController implements Controller {
    public readonly path = '/order'
    public readonly router = Router()
    private notificationService: NotificationService
    private orderRepository: OrderRepository
    private orderDao: OrderDao

    constructor() {
        this.notificationService = MailService.getInstance()
        this.orderRepository = new OrderRepository()
        this.orderDao = new OrderMongooseDao()
        this.initializeRoutes()
    }

    private initializeRoutes(): void {
        this.router.post(`${this.path}/create`, tryCatch(this.createOrder))
        this.router.get(`${this.path}/:id`, tryCatch(this.getOrder))
        this.router.post(`${this.path}/update/:id`, tryCatch(this.updateStatus))
    }
    private createOrder = async (
        req: Request,
        res: Response
    ): Promise<Response | void> => {
        const { listProductId, deliveryInfo } = req.body
        const result = await this.orderRepository.createOrderFromCart(
            listProductId,
            deliveryInfo
        )
        return res.json(new BaseResponse().ok('Info: ' + result))
    }

    private getOrder = async (
        req: Request,
        res: Response
    ): Promise<Response | void> => {
        const { id } = req.params
        const cartIdObject = await this.orderRepository.getOrderInfo(id)
        return res.json(
            new BaseResponse().ok('Fetched Order info', {
                Order_info: cartIdObject,
            })
        )
    }
    private updateStatus = async (
        req: Request,
        res: Response
    ): Promise<Response | void> => {
        const { id } = req.params
        const { status } = req.body
        const Status = await this.orderRepository.updateStatus(id, status)
        if (!Status) {
            throw new BadRequestError('Order not found')
        }
        return res.json(new BaseResponse().ok('Info: Update Order', Status))
    }
}
