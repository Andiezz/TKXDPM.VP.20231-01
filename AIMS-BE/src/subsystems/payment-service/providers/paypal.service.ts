import paypal from '@paypal/checkout-server-sdk'
import { PayRequestDto } from '../dtos/pay.dto'
import { PaymentService } from '../interfaces/payment.service'

export class PaypalService implements PaymentService {
    private paypalClient
    private environment
    // private clientId
    // private clientSecret
    // private baseUrl
    constructor() {
        // this.clientId = process.env.PAYPAL_CLIENT_ID
        // this.clientSecret = process.env.PAYPAL_CLIENT_SECRET
        // this.baseUrl = process.env.PAYPAL_URL

        this.environment = paypal.core.SandboxEnvironment
        this.paypalClient = new paypal.core.PayPalHttpClient(
            new this.environment(
                process.env.PAYPAL_CLIENT_ID!,
                process.env.PAYPAL_CLIENT_SECRET!
            )
        )
    }
    captureTransaction(): Promise<void> {
        throw new Error('Method not implemented.')
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

    // public async testPay(input: PayRequestDto): Promise<string> {
    //     const accessToken = this.getAccessToken()

    //     const convertedTotal = this.convertVndToUsd(input.amount)
    //     const orderData = {
    //         intent: 'CAPTURE',
    //         application_context: {
    //             brand_name: 'AIMS SYSTEM',
    //             locale: 'en-US',
    //             user_action: 'PAY_NOW',
    //         },
    //         purchase_units: [
    //             {
    //                 amount: {
    //                     currency_code: 'USD',
    //                     value: convertedTotal,
    //                 },
    //             },
    //         ],
    //     }
    //     const data = JSON.stringify(orderData)

    //     const response = await fetch(this.baseUrl + '/v2/checkout/orders', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             Authorization: `Bearer ${accessToken}`,
    //             'PayPal-Request-Id': uuidv4(),
    //         },
    //         body: data,
    //     })
    //     const body = await response.text()
    //     console.log(body)

    //     return 'response'
    // }
    public getBalance(): void {
        throw new Error('Method not implemented.')
    }
    public async refund(payment_id: string): Promise<any> {
        const request = new paypal.payments.CapturesRefundRequest(payment_id)

        request.requestBody({
            amount: {
                value: '0.41',
                currency_code: 'USD',
            },
            invoice_id: '"38H03876434274135"',
            note_to_payer: 'Defective product',
        })

        const response = await this.paypalClient.execute(request)
        console.log(response)
        return response
    }

    // private async getAccessToken() {
    //     const auth = `${this.clientId}:${this.clientSecret}`
    //     const data = 'grant_type=client_credentials'

    //     const resp = await fetch(this.baseUrl + '/v1/oauth2/token', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/x-www-form-urlencoded',
    //             Authorization: `Basic ${Buffer.from(auth).toString('base64')}`,
    //         },
    //         body: data,
    //     })
    //     const body: any = await resp.text()
    //     return body.access_token
    // }

    private convertVndToUsd(total: number): string {
        const CONVERSION_RATE = 0.000041
        return (total * CONVERSION_RATE).toFixed(2)
    }
}
