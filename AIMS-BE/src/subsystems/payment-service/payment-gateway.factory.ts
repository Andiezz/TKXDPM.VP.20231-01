import { BadRequestError } from '../../errors'
import { PaymentService } from './interfaces/payment.service'

export class PaymentGatewayFactory {
    private providers: Record<string, PaymentService> = {}
    private static instance: PaymentGatewayFactory

    private constructor() {}

    public static getInstance(): PaymentGatewayFactory {
        if (!PaymentGatewayFactory.instance) {
            PaymentGatewayFactory.instance = new PaymentGatewayFactory()
        }

        return PaymentGatewayFactory.instance
    }

    public register(payment_method: string, provider: any): void {
        this.providers[payment_method] = new provider()
    }

    public resolve(payment_method: string): any {
        const matchedProvider = this.providers[payment_method]

        if (!matchedProvider) {
            throw new BadRequestError(
                `This payment method is not supported: ${payment_method}`
            )
        }

        return matchedProvider
    }
}

export enum PAYMENT_METHOD {
    PAYPAL = 'paypal',
    VNPAY = 'vnpay',
}
