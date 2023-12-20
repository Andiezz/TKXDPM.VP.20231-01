// import { Request, RequestHandler, Response, Router } from 'express'
// import { BaseResponse } from '../../common/base-response'
// import Controller from '../../common/controller.interface'
// import { USER_ROLE } from '../../configs/enums'
// import { UsersDao, UsersMongooseDao } from '../../data-access-layer/daos/users'
// import { CreateUserDto, UpdateUserInfoDto } from '../../dtos/users.dto'
// import { BadRequestError } from '../../errors'
// import { jwtAuthGuard, rolesGuard } from '../../middlewares/auth.middleware'
// import { tryCatch } from '../../middlewares/error.middleware'
// import * as validators from '../../middlewares/validators.middleware'
// import { compareHash, hashData } from '../../utils/security'
// import {
//     NotificationService,
//     RecipientDto,
// } from '../../subsystems/notification-service'
// import { MailService } from '../../subsystems/notification-service/providers/mail.service'
// import { CartDao, CartMongooseDao } from '../../data-access-layer/daos/cart'
// import { UpdateCartDto } from '../../dtos/cart.dto'
// import { CartRepository } from '../../data-access-layer/repositories/carts/cart.respository'

// export class CartManagementController implements Controller {
//     public readonly path = '/cart'
//     public readonly router = Router()
//     private cartDao: CartDao
//     private notificationService: NotificationService
//     private cartRepository: CartRepository

//     constructor() {
//         this.notificationService = MailService.getInstance()
//         this.cartDao = new CartMongooseDao()
//         this.cartRepository = new CartRepository()

//         this.initializeRoutes()
//     }

//     private initializeRoutes(): void {
//         this.router.patch(`${this.path}/update`, tryCatch(this.updateCartInfo))
//         this.router.get(
//             `${this.path}/getCart`,
//             tryCatch(this.getCart as RequestHandler)
//         )
//         this.router.get(
//             `${this.path}/resetCart`,
//             tryCatch(this.ResetCart as RequestHandler)
//         )
//     }

//     private updateCartInfo = async (
//         req: Request,
//         res: Response
//     ): Promise<Response | void> => {
//         const productId = req.query.productId as string
//         const quantity = Number(req.query.quantity)
//         await this.cartRepository.updateCartInfo(productId, quantity)
//         return res.json(new BaseResponse().ok('Updated cart info'))
//     }
//     private ensureCart = async (req: Request, res: Response): Promise<void> => {
//         const { userId } = req.params
//         const cartIdObject = await this.cartDao.getCartDetail(userId)
//         if (!cartIdObject) {
//             await this.cartDao.seedCart(userId)
//         }
//     }
//     private getCart = async (
//         req: Request,
//         res: Response
//     ): Promise<Response | void> => {
//         const cartIdObject = await this.cartRepository.getCartInfo()
//         return res.json(
//             new BaseResponse().ok('Fetched Cart info', {
//                 cart_info: cartIdObject,
//             })
//         )
//     }
//     private ResetCart = async (
//         req: Request,
//         res: Response
//     ): Promise<Response | void> => {
//         await this.cartRepository.resetCart()

//         const cartIdObjectNew = await this.cartRepository.getCartInfo()
//         return res.json(
//             new BaseResponse().ok('Fetched Cart info', {
//                 cart_info: cartIdObjectNew,
//             })
//         )
//     }
// }
