import { BadRequestError } from '../../errors'
import { PaymentService } from './interfaces/payment.service'
import { PaypalService } from './providers/paypal.service'
import { VNPayService } from './providers/vnpay.service'

export class PaymentGatewayFactory {
    private paymentServices: Record<string, PaymentService>

    constructor() {
        this.paymentServices = {}
        this.paymentServices[PAYMENT_METHOD.PAYPAL] = new PaypalService()
        this.paymentServices[PAYMENT_METHOD.VNPAY] = new VNPayService()
    }

    public getInstance(payment_method: PAYMENT_METHOD) {
        const instance = this.paymentServices[payment_method]

        if (!instance) {
            throw new BadRequestError('This payment method is not supported')
        }

        return instance
    }
}

export enum PAYMENT_METHOD {
    PAYPAL = 'paypal',
    VNPAY = 'vnpay',
}
