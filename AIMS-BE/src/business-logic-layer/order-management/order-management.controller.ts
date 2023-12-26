import { Request, RequestHandler, Response, Router } from 'express'
import { BaseResponse } from '../../common/base-response'
import Controller from '../../common/controller.interface'
import { DELIVERY_METHOD, USER_ROLE } from '../../configs/enums'
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
import { OrderRepository } from '../../data-access-layer/repositories/orders/providers/order.respository'
import {
    CreateOrderFromCart,
    CreateOrderProductDto,
} from '../../dtos/order-product.dto'
import { OrderDao, OrderMongooseDao } from '../../data-access-layer/daos/order'
import { CreateDeliveryInfoDto } from '../../dtos/delivery-info.dto'
import { ProductsDao } from '../../data-access-layer/daos/products/interfaces/products.dao.interface'
import { ProductModel } from '../../data-access-layer/daos/products/schemas/product.model'
import { ProductsMongooseDao } from '../../data-access-layer/daos/products/providers/products.mongoose.dao'
import { ORDER_STATUS, PROVINCE } from '../../configs/constants'
import { CreateOrderDto } from '../../dtos/order.dto'
import { DeliveryInfoDao } from '../../data-access-layer/daos/delivery-info/interfaces/delivery-info.dao'
import { DeliveryInfoMongooseDao } from '../../data-access-layer/daos/delivery-info/providers/delivery-info.mongoose.dao'
import { OrderProductDao } from '../../data-access-layer/daos/order-product/interface/order-product.dao'
import { OrderProductMongooseDao } from '../../data-access-layer/daos/order-product/providers/order-product.mongoose.dao'

export class OrderManagementController implements Controller {
    public readonly path = '/order'
    public readonly router = Router()
    private notificationService: NotificationService
    private orderRepository: OrderRepository
    private orderDao: OrderDao
    private productDao: ProductsDao
    private deliveryInfoDao: DeliveryInfoDao
    private orderProductDao: OrderProductDao

    constructor() {
        this.notificationService = MailService.getInstance()
        this.orderRepository = new OrderRepository()
        this.orderDao = new OrderMongooseDao()
        this.productDao = new ProductsMongooseDao(ProductModel.getInstance())
        this.deliveryInfoDao = new DeliveryInfoMongooseDao()
        this.orderProductDao = new OrderProductMongooseDao()
        this.productDao = new ProductsMongooseDao(ProductModel.getInstance())
        this.initializeRoutes()
    }

    private initializeRoutes(): void {
        this.router.post(`${this.path}/create`, tryCatch(this.createOrder))
        this.router.get(`${this.path}/:id`, tryCatch(this.getOrder))
        this.router.post(`${this.path}/update/:id`, tryCatch(this.updateStatus))
        this.router.get(`${this.path}`, tryCatch(this.findAll))
    }
    private createOrder = async (
        req: Request,
        res: Response
    ): Promise<Response | void> => {
        const { listProductId, deliveryInfo } = req.body
        // Check input null
        if (!listProductId || !deliveryInfo) {
            throw new BadRequestError('List product or Delivery info error ')
        }
        if (!Array.isArray(listProductId)) {
            throw new BadRequestError('Expected an array for listProductId')
        }
        // get list product in database
        const productIds = listProductId.map((productCart) =>
            productCart.productId.toString()
        )
        const listProductDetail = await this.productDao.findMany(productIds)
        // Check product tồn kho
        for (const productCart of listProductId) {
            const productDetail = listProductDetail.find(
                (product) =>
                    product.id.toString() === productCart.productId.toString()
            )
            if (!productDetail) {
                throw new BadRequestError('Product not found in detail list')
            }
            if (productCart.quantity > productDetail.quantity) {
                throw new BadRequestError('Số lượng trong kho không đủ')
            }
        }
        // Check address support rush
        if (deliveryInfo.deliveryMethod == DELIVERY_METHOD.RUSH) {
            const HN = PROVINCE.find((province) => province.code === 1) // 1 is the code for Hà Nội
            if (deliveryInfo.province != HN?.name) {
                throw new BadRequestError(
                    'Address not available in your province'
                )
            }

            // Check product hỗ trợ giao hàng nhanh
            let checkProductRush = 0
            for (const product of listProductDetail) {
                if (product.supportRush) {
                    checkProductRush = 1
                    break
                }
            }
            if (checkProductRush == 0) {
                throw new BadRequestError('All product not available')
            }
        }
        //
        let listProductDetails = []
        //Caculate Price
        let totalPrice = 0
        let widthMax = 0
        for (const productCart of listProductId) {
            const productDetail = listProductDetail.find(
                (product) =>
                    product.id.toString() === productCart.productId.toString()
            )
            if (!productDetail) {
                throw new BadRequestError('Product not found')
            }

            listProductDetails.push({
                productDetail: productDetail,
                quantity: productCart.quantity,
            })

            totalPrice += productDetail.price * productCart.quantity
            if (
                productDetail.productDimensions &&
                productDetail.productDimensions.width &&
                widthMax <= productDetail.productDimensions.width
            ) {
                widthMax = productDetail.productDimensions.width
            }
        }
        // Create Delivery Detail
        await this.deliveryInfoDao.create(deliveryInfo)
        // Get ID delivery
        const deliveryInfoIdObject =
            await this.deliveryInfoDao.getLatestDeliveryInfoId()
        if (!deliveryInfoIdObject) {
            throw new BadRequestError('DeliveryInfo error')
        }
        const deliveryInfoId: string = deliveryInfoIdObject.toString()

        const HN = PROVINCE.find((province) => province.code === 1) // 1 is the code for Hà Nội
        const HCM = PROVINCE.find((province) => province.code === 79) // 79 is the code for Hồ Chí Minh
        //Caculate ShippingCost
        let shippingCost
        if (totalPrice * 1.1 > 100000) {
            shippingCost = 0
        } else if (
            deliveryInfo.province == HN?.name ||
            deliveryInfo.province == HCM?.name
        ) {
            if (widthMax <= 3) {
                shippingCost = widthMax * 22000
            } else {
                shippingCost = 3 * 22000 + (widthMax - 3) * 2 * 2500
            }
        } else {
            if (widthMax <= 0.5) {
                shippingCost = widthMax * 30000
            } else {
                shippingCost = 0.5 * 30000 + (widthMax - 0.5) * 2 * 2500
            }
        }
        if (deliveryInfo.deliveryMethod == DELIVERY_METHOD.RUSH) {
            shippingCost = shippingCost + 10000
        }

        const createOrderDto: CreateOrderDto = {
            totalPrice: totalPrice,
            totalPriceVAT: totalPrice * 0.1,
            deliveryInfoId: deliveryInfoId,
            shippingCost: shippingCost,
            status: ORDER_STATUS.PENDING,
            totalAmount: totalPrice * 1.1 + shippingCost,
        }
        const result = await this.orderRepository.createOrderFromCart(
            listProductId,
            createOrderDto
        )

        const recipient = new RecipientDto(deliveryInfo.email)
        this.notificationService.sendMailDetailOrder(recipient, result)
        const deliveryInfoDetail = await this.deliveryInfoDao.findById(
            deliveryInfoId.toString()
        )
        const data = {
            orderId: result,
            listProduct: listProductDetails,
            totalPrice: totalPrice,
            totalPriceVAT: totalPrice * 0.1,
            deliveryInfoDetail: deliveryInfoDetail,
            shippingCost: shippingCost,
            status: ORDER_STATUS.PENDING,
            totalAmount: totalPrice * 1.1 + shippingCost,
        }

        return res.json(
            new BaseResponse().ok('Create order successfully', data)
        )
    }

    private getOrder = async (
        req: Request,
        res: Response
    ): Promise<Response | void> => {
        const { id } = req.params
        const orderDoc = await this.orderDao.findById(id)
        if (!orderDoc) {
            throw new BadRequestError('Order not found')
        }
        const {
            totalPrice,
            totalPriceVAT,
            status,
            shippingCost,
            deliveryInfoId,
            totalAmount,
        } = orderDoc
        const listProduct = await this.orderProductDao.findProductsByOrderId(id)
        if (!listProduct) {
            throw new BadRequestError('DeliveryInfo error')
        }

        // list productSupportRush and listProductNomal
        let listProductRush = []
        let listProductNomal = []
        for (const product of listProduct) {
            if (product.productId.supportRush == true) {
                listProductRush.push(product)
            } else {
                listProductNomal.push(product)
            }
        }
        const deliveryInfo = await this.deliveryInfoDao.findById(
            deliveryInfoId.toString()
        )
        const data = {
            orderId: id,
            listProductRush,
            listProductNomal,
            deliveryInfo,
            totalPrice,
            totalPriceVAT,
            status,
            shippingCost,
            totalAmount,
        }
        return res.json(
            new BaseResponse().ok('Fetched Order info', {
                Order_info: data,
            })
        )
    }
    private updateStatus = async (
        req: Request,
        res: Response
    ): Promise<Response | void> => {
        const { id } = req.params
        const { status } = req.body
        if (status == ORDER_STATUS.CONFIRM) {
            const orderDoc = await this.orderDao.findById(id)
            if (!orderDoc) {
                throw new BadRequestError('Order not found')
            }
            const listProduct =
                await this.orderProductDao.findProductsByOrderId(id)
            if (!listProduct) {
                throw new BadRequestError('DeliveryInfo error')
            }
            for (const product of listProduct) {
                const productDB = await this.productDao.findById(
                    product.productId.id
                )
                if (!productDB) {
                    throw new BadRequestError('product ID not found')
                }
                if (product.quantity > productDB.quantity) {
                    throw new BadRequestError('San pham trong kho khong du')
                }
            }
            const statusOrder = await this.orderDao.updateStatus(id, status)
            if (!statusOrder) {
                throw new BadRequestError('Order not found')
            }
            return res.json(
                new BaseResponse().ok('Info: Update Order', statusOrder)
            )
        } else {
            const statusOrder = await this.orderDao.updateStatus(id, status)
            if (!statusOrder) {
                throw new BadRequestError('Order not found')
            }
            return res.json(
                new BaseResponse().ok('Info: Update Order', statusOrder)
            )
        }
    }

    private findAll = async (
        req: Request,
        res: Response
    ): Promise<Response | void> => {
        const Status = await this.orderRepository.getAllOrderInfo()
        if (!Status) {
            throw new BadRequestError('Order not found')
        }
        return res.json(new BaseResponse().ok('Get Order Success', Status))
    }
}
