import { PayRequestDto } from '../dtos/pay.dto'
import { RefundRequestDto } from '../dtos/refund.dto'

export interface PaymentService {
    pay(input: PayRequestDto): Promise<string>
    refund(input: RefundRequestDto): Promise<boolean>
}
