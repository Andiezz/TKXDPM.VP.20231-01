import moment from 'moment'
import { PayRequestDto } from '../dtos/pay.dto'
import { PaymentService } from '../interfaces/payment.service'
export class VNPayService implements PaymentService {
    private tmnCode
    private secretKey
    private returnUrl
    private vnpUrl

    constructor() {
        this.tmnCode = process.env.VNPAY_TMN_CODE
        this.secretKey = process.env.VNPAY_HASH_SECRET
        this.returnUrl = process.env.VNPAY_RETURN_URL
        this.vnpUrl = process.env.VNPAY_URL
    }
    testPay(input: PayRequestDto): Promise<string> {
        throw new Error('Method not implemented.')
    }

    async pay(input: PayRequestDto): Promise<string> {
        process.env.TZ = 'Asia/Ho_Chi_Minh'

        const date = new Date()
        const createDate = moment(date).format('YYYYMMDDHHmmss')

        const amount = input.amount
        const invoiceId = input.invoiceId
        const locale = 'vn'
        const currCode = 'VND'
        const ipAddress = input.ipAddress

        let vnp_Params: any = {}
        vnp_Params['vnp_Version'] = '2.1.0'
        vnp_Params['vnp_Command'] = 'pay'
        vnp_Params['vnp_TmnCode'] = this.tmnCode
        vnp_Params['vnp_Locale'] = locale
        vnp_Params['vnp_CurrCode'] = currCode
        vnp_Params['vnp_TxnRef'] = invoiceId
        vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + invoiceId
        vnp_Params['vnp_OrderType'] = 'other'
        vnp_Params['vnp_Amount'] = amount * 100
        vnp_Params['vnp_ReturnUrl'] = this.returnUrl
        vnp_Params['vnp_IpAddr'] = ipAddress
        vnp_Params['vnp_CreateDate'] = createDate

        vnp_Params = this.sortObject(vnp_Params)

        let querystring = require('qs')
        let signData = querystring.stringify(vnp_Params, { encode: false })
        let crypto = require('crypto')
        let hmac = crypto.createHmac('sha512', this.secretKey)
        let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex')
        vnp_Params['vnp_SecureHash'] = signed
        const createPaymentUrl =
            this.vnpUrl +
            '?' +
            querystring.stringify(vnp_Params, { encode: false })

        return createPaymentUrl
    }

    async captureTransaction(input: any): Promise<any> {
        let vnp_Params: any = input
        const secureHash = vnp_Params['vnp_SecureHash']

        const orderId = vnp_Params['vnp_TxnRef']
        const rspCode = vnp_Params['vnp_ResponseCode']

        delete vnp_Params['vnp_SecureHash']
        delete vnp_Params['vnp_SecureHashType']

        vnp_Params = this.sortObject(vnp_Params)

        const querystring = require('qs')
        const signData = querystring.stringify(vnp_Params, { encode: false })
        const crypto = require('crypto')
        const hmac = crypto.createHmac('sha512', this.secretKey)
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex')

        const checksum = secureHash === signed
        return checksum
        const paymentStatus = '0' // Giả sử '0' là trạng thái khởi tạo giao dịch, chưa có IPN. Trạng thái này được lưu khi yêu cầu thanh toán chuyển hướng sang Cổng thanh toán VNPAY tại đầu khởi tạo đơn hàng.
        //const paymentStatus = '1'; // Giả sử '1' là trạng thái thành công bạn cập nhật sau IPN được gọi và trả kết quả về nó
        //const paymentStatus = '2'; // Giả sử '2' là trạng thái thất bại bạn cập nhật sau IPN được gọi và trả kết quả về nó

        const checkOrderId = true // Mã đơn hàng "giá trị của vnp_TxnRef" VNPAY phản hồi tồn tại trong CSDL của bạn
        const checkAmount = true // Kiểm tra số tiền "giá trị của vnp_Amout/100" trùng khớp với số tiền của đơn hàng trong CSDL của bạn
        if (secureHash === signed) {
            //kiểm tra checksum
            if (checkOrderId) {
                if (checkAmount) {
                    if (paymentStatus == '0') {
                        //kiểm tra tình trạng giao dịch trước khi cập nhật tình trạng thanh toán
                        if (rspCode == '00') {
                            //thanh cong
                            //paymentStatus = '1'
                            // Ở đây cập nhật trạng thái giao dịch thanh toán thành công vào CSDL của bạn
                            return {
                                RspCode: '00',
                                Message: 'Success',
                            }
                        } else {
                            //that bai
                            //paymentStatus = '2'
                            // Ở đây cập nhật trạng thái giao dịch thanh toán thất bại vào CSDL của bạn
                            return {
                                RspCode: '00',
                                Message: 'Success',
                            }
                        }
                    } else {
                        return {
                            RspCode: '02',
                            Message:
                                'This order has been updated to the payment status',
                        }
                    }
                } else {
                    return {
                        RspCode: '04',
                        Message: 'Amount invalid',
                    }
                }
            } else {
                return {
                    RspCode: '01',
                    Message: 'Order not found',
                }
            }
        } else {
            return { RspCode: '97', Message: 'Checksum failed' }
        }
    }

    getBalance(): void {
        throw new Error('Method not implemented.')
    }
    refund(): Promise<any> {
        throw new Error('Method not implemented.')
    }

    private sortObject(obj: any): Object {
        let sorted: any = {}
        let str = []
        let key
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                str.push(encodeURIComponent(key))
            }
        }
        str.sort()
        for (key = 0; key < str.length; key++) {
            sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(
                /%20/g,
                '+'
            )
        }
        return sorted
    }
}
