import paypal from '@paypal/checkout-server-sdk'
import { PayRequestDto } from '../dtos/pay.dto'
import { PaymentService } from '../interfaces/payment.service'
import { RefundRequestDto } from '../dtos/refund.dto'

export class PaypalService implements PaymentService {
    private readonly paypalClient
    private readonly environment
    private readonly CONVERSION_RATE = 0.000041

    public constructor() {
        this.environment = paypal.core.SandboxEnvironment
        this.paypalClient = new paypal.core.PayPalHttpClient(
            new this.environment(
                process.env.PAYPAL_CLIENT_ID!,
                process.env.PAYPAL_CLIENT_SECRET!
            )
        )
    }

    public async pay(input: PayRequestDto): Promise<string> {
        const convertedTotal = this.convertVndToUsd(input.amount)

        const request = new paypal.orders.OrdersCreateRequest()
        request.requestBody({
            intent: 'CAPTURE',
            application_context: {
                brand_name: 'AIMS SYSTEM',
                locale: 'en-US',
                user_action: 'PAY_NOW',
            },
            purchase_units: [
                {
                    reference_id: input.orderId,
                    amount: {
                        currency_code: 'USD',
                        value: convertedTotal,
                    },
                },
            ],
        })

        const response = await this.paypalClient.execute(request)

        return response.result.id
    }

    public async refund(input: RefundRequestDto): Promise<boolean> {
        try {
            const request = new paypal.payments.CapturesRefundRequest(
                input.captureId!
            )
            await this.paypalClient.execute(request)
            return true
        } catch (e) {
            console.log(e)
            return false
        }
    }

    private convertVndToUsd(total: number): string {
        return (total * this.CONVERSION_RATE).toFixed(2)
    }
}
