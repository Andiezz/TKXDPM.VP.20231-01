import { Request, RequestHandler, Response, Router } from 'express'
import { BaseResponse } from '../../common/base-response'
import Controller from '../../common/controller.interface'
import { USER_ROLE } from '../../configs/enums'
import { OrderDao, OrderMongooseDao } from '../../data-access-layer/daos/order'
import {
    TransactionDao,
    TransactionMongooseDao,
} from '../../data-access-layer/daos/transactions'
import { CreateTransactionDto } from '../../dtos/payments.dto'
import { BadRequestError, ForbiddenError } from '../../errors'
import { jwtAuthGuard, rolesGuard } from '../../middlewares/auth.middleware'
import { tryCatch } from '../../middlewares/error.middleware'
import * as validators from '../../middlewares/validators.middleware'
import { PaymentGatewayFactory } from '../../subsystems/payment-service'
import { PayRequestDto } from '../../subsystems/payment-service/dtos/pay.dto'
import { RefundRequestDto } from '../../subsystems/payment-service/dtos/refund.dto'
import { ORDER_STATUS } from '../../configs/constants'
import {
    MailService,
    NotificationService,
    RecipientDto,
} from '../../subsystems/notification-service'
import { DeliveryInfoDao } from '../../data-access-layer/daos/delivery-info/interfaces/delivery-info.dao'
import { DeliveryInfoMongooseDao } from '../../data-access-layer/daos/delivery-info/providers/delivery-info.mongoose.dao'

export class PaymentController implements Controller {
    public readonly path = '/payments'
    public readonly router = Router()
    private readonly paymentGatewayFactory
    private readonly transactionsDao: TransactionDao
    private readonly orderDao: OrderDao
    private readonly notificationService: NotificationService
    private readonly deliveryInfoDao: DeliveryInfoDao

    public constructor() {
        this.paymentGatewayFactory = PaymentGatewayFactory.getInstance()
        this.transactionsDao = new TransactionMongooseDao()
        this.orderDao = new OrderMongooseDao()
        this.notificationService = MailService.getInstance()
        this.deliveryInfoDao = new DeliveryInfoMongooseDao()

        this.initializeRoutes()
    }

    private initializeRoutes(): void {
        this.router.get(`${this.path}`, tryCatch(this.getView))

        this.router.post(
            `${this.path}/checkout`,
            validators.payRequest,
            tryCatch(this.pay)
        )

        this.router.post(
            `${this.path}/txn/capture`,
            validators.payRequest,
            tryCatch(this.captureTransaction)
        )

        this.router.post(
            `${this.path}/refund/:orderId`,
            validators.refundRequest,
            tryCatch(this.refund)
        )
    }

    private pay = async (
        req: Request,
        res: Response
    ): Promise<Response | void> => {
        const ipAddress = req.ip || req.connection.remoteAddress
        const payReqDto = new PayRequestDto({ ...req.body, ipAddress })

        const orderDoc = await this.orderDao.findById(payReqDto.orderId)
        if (!orderDoc) {
            throw new BadRequestError('Invalid order id')
        }

        if (
            Number(orderDoc.totalAmount).toFixed() >
            Number(payReqDto.amount).toFixed()
        ) {
            throw new BadRequestError('Insufficient amount')
        }

        const paymantService = this.paymentGatewayFactory.resolve(
            payReqDto.paymentMethod
        )
        const result = await paymantService.pay(payReqDto)

        return res.json(
            new BaseResponse().ok('Sent payment request', {
                result,
            })
        )
    }

    private captureTransaction = async (
        req: Request,
        res: Response
    ): Promise<Response | void> => {
        const createTxnReq = new CreateTransactionDto({ ...req.body })
        const orderDoc = await this.orderDao.findById(createTxnReq.orderId)
        if (!orderDoc) {
            throw new BadRequestError('Invalid order id')
        }

        await this.transactionsDao.create(createTxnReq)

        await this.orderDao.updateStatus(
            createTxnReq.orderId,
            ORDER_STATUS.PAID
        )
        const deliveryInfo = await this.deliveryInfoDao.findById(
            orderDoc.deliveryInfoId.toString()
        )

        if (!deliveryInfo) {
            throw new BadRequestError('Delivery info not found')
        }

        const recipient = new RecipientDto(deliveryInfo.email)
        this.notificationService.pushOrderPaidNotification(
            recipient,
            createTxnReq.orderId.toString()
        )

        return res.json(new BaseResponse().ok('Captured payment transaction'))
    }

    private refund = async (
        req: Request,
        res: Response
    ): Promise<Response | void> => {
        const { orderId } = req.params

        const ipAddress = req.ip || '::1'

        const orderDoc = await this.orderDao.findById(orderId)
        if (!orderDoc) {
            throw new BadRequestError('Invalid order id')
        }
        if (orderDoc.status != ORDER_STATUS.PAID) {
            throw new ForbiddenError('Can only refund paid order')
        }

        const txnDoc = await this.transactionsDao.findByOrderId(orderId)
        if (!txnDoc) {
            throw new BadRequestError('Transaction not found')
        }

        const paymantService = this.paymentGatewayFactory.resolve(
            txnDoc.paymentMethod
        )

        const refundReqDto = new RefundRequestDto({
            ...txnDoc,
            ipAddress,
            transactionDate: txnDoc.createdAt,
        })

        const result = await paymantService.refund(refundReqDto)

        if (!result) {
            throw new BadRequestError('Refund fail')
        }

        const refundTxn = new CreateTransactionDto({
            ...txnDoc,
            amount: txnDoc.amount * -1,
        })
        await this.transactionsDao.create(refundTxn)

        await this.orderDao.updateStatus(orderId, ORDER_STATUS.REFUNDED)

        const deliveryInfo = await this.deliveryInfoDao.findById(
            orderDoc.deliveryInfoId.toString()
        )

        if (!deliveryInfo) {
            throw new BadRequestError('Delivery info not found')
        }

        const recipient = new RecipientDto(deliveryInfo.email)
        this.notificationService.pushOrderRefundedNotification(
            recipient,
            orderId
        )

        return res.json(new BaseResponse().ok('Fully refund payment'))
    }

    private getView = async (
        req: Request,
        res: Response
    ): Promise<Response | void> => {
        return (res as any).render('index', {
            paypalClientId: process.env.PAYPAL_CLIENT_ID,
        })
    }
}
