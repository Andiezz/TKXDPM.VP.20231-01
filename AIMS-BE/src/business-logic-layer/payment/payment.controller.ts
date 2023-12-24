import {
    Request,
    RequestHandler,
    RequestParamHandler,
    Response,
    Router,
} from 'express'
import { BaseResponse } from '../../common/base-response'
import Controller from '../../common/controller.interface'
import { tryCatch } from '../../middlewares/error.middleware'
import * as validators from '../../middlewares/validators.middleware'
import { PaymentGatewayFactory } from '../../subsystems/payment-service'
import { PayRequestDto } from '../../subsystems/payment-service/dtos/pay.dto'
import { RefundRequestDto } from '../../subsystems/payment-service/dtos/refund.dto'
import { ValidationChain } from 'express-validator'
import {
    TransactionDao,
    TransactionMongooseDao,
} from '../../data-access-layer/daos/transactions'
import { CreateTransactionDto } from '../../dtos/payments.dto'
import { BadRequestError, ForbiddenError } from '../../errors'
import { jwtAuthGuard, rolesGuard } from '../../middlewares/auth.middleware'
import { ORDER_STATUS, USER_ROLE } from '../../configs/enums'
import { OrderDao, OrderMongooseDao } from '../../data-access-layer/daos/order'
export class PaymentController implements Controller {
    public readonly path = '/payments'
    public readonly router = Router()
    private readonly paymentGatewayFactory: PaymentGatewayFactory
    private readonly transactionsDao: TransactionDao
    private readonly orderDao: OrderDao

    public constructor() {
        this.paymentGatewayFactory = new PaymentGatewayFactory()
        this.transactionsDao = new TransactionMongooseDao()
        this.orderDao = new OrderMongooseDao()
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
            jwtAuthGuard as RequestHandler,
            rolesGuard([USER_ROLE.ADMIN, USER_ROLE.MANAGER]) as RequestHandler,
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

        //TODO: Check order status
        // const orderDoc = await this.orderDao.findById(payReqDto.orderId)
        // if (!orderDoc) {
        //     throw new BadRequestError('Invalid order id')
        // }
        // if (orderDoc.status != ORDER_STATUS.PAID) {
        //     throw new ForbiddenError('Can only refund paid order')
        // }

        // TODO: Check amount

        const paymantService = this.paymentGatewayFactory.getInstance(
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

        await this.transactionsDao.create(createTxnReq)
        return res.json(new BaseResponse().ok('Captured payment transaction'))
    }

    private refund = async (
        req: Request,
        res: Response
    ): Promise<Response | void> => {
        const { orderId } = req.params

        const ipAddress = req.ip || '::1'
        //TODO: Check order status
        // const orderDoc = await this.orderDao.findById(orderId)
        // if (!orderDoc) {
        //     throw new BadRequestError('Invalid order id')
        // }
        // if (orderDoc.status != ORDER_STATUS.PAID) {
        //     throw new ForbiddenError('Can only refund paid order')
        // }

        const txnDoc = await this.transactionsDao.findByOrderId(orderId)
        if (!txnDoc) {
            throw new BadRequestError('Transaction not found')
        }

        const paymantService = this.paymentGatewayFactory.getInstance(
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

        // TODO: Update Order status
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
