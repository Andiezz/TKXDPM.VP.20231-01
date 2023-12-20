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
export class PaymentController implements Controller {
    public readonly path = '/payments'
    public readonly router = Router()
    private paymentGatewayFactory: PaymentGatewayFactory
    private transactionsDao: TransactionDao

    constructor() {
        this.paymentGatewayFactory = new PaymentGatewayFactory()
        this.transactionsDao = new TransactionMongooseDao()
        this.initializeRoutes()
    }

    private initializeRoutes(): void {
        this.router.get(`${this.path}`, tryCatch(this.getView))

        this.router.post(
            `${this.path}/checkout`,
            validators.payRequest,
            tryCatch(this.pay)
        )

        this.router.patch(
            `${this.path}/txn/capture/:transactionId`,
            validators.captureTransaction,
            tryCatch(this.captureTransaction)
        )

        this.router.post(
            `${this.path}/refund`,
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

        const paymantService = this.paymentGatewayFactory.getInstance(
            payReqDto.payment_method
        )

        const result = await paymantService.pay(payReqDto)

        const txnInfo = {
            invoiceId: payReqDto.invoiceId,
            paymentMethod: payReqDto.payment_method,
            amount: payReqDto.amount,
            currency: payReqDto.currency,
            paymentDate: Date.now(),
        }
        const createTxnDto = new CreateTransactionDto(txnInfo)

        const txnDoc = await this.transactionsDao.create(createTxnDto)

        return res.json(
            new BaseResponse().ok('Sent payment request', {
                result,
                txn: txnDoc,
            })
        )
    }

    private captureTransaction = async (
        req: Request,
        res: Response
    ): Promise<Response | void> => {
        const { transactionId } = req.params
        const { status } = req.body
        await this.transactionsDao.updateStatus(transactionId, status)

        return res.json(
            new BaseResponse().ok(
                'Updated payment transaction status transaction'
            )
        )
    }

    private refund = async (
        req: Request,
        res: Response
    ): Promise<Response | void> => {
        const refundDto = <RefundRequestDto>req.body

        const paymantService = this.paymentGatewayFactory.getInstance(
            refundDto.payment_method
        )

        const result = await paymantService.refund(refundDto.payment_id)

        return res.json(result)
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
