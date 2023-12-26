import { PaymentGatewayFactory } from '../payment-gateway.factory'

export function PaymentProvider(payment_method: string): Function {
    return function (target: any): void {
        PaymentGatewayFactory.getInstance().register(payment_method, target)
    }
}
