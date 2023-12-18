import { PayRequestDto } from '../dtos/pay.dto'

export interface PaymentService {
    pay(input: PayRequestDto): Promise<string>
    // testPay(input: PayRequestDto): Promise<string>
    captureTransaction(input: any): Promise<void>
    getBalance(): any
    refund(payment_id: string): Promise<any>
}
