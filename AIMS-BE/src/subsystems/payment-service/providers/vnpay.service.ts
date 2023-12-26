import moment from 'moment'
import axios, { AxiosResponse, AxiosError } from 'axios'
import { PayRequestDto } from '../dtos/pay.dto'
import { PaymentService } from '../interfaces/payment.service'
import { RefundRequestDto } from '../dtos/refund.dto'
import { PaymentProvider } from '../decorators/payment-provider'
import { PAYMENT_METHOD } from '../payment-gateway.factory'

@PaymentProvider(PAYMENT_METHOD.VNPAY)
export class VNPayService implements PaymentService {
    private readonly tmnCode: string
    private readonly secretKey: string
    private readonly returnUrl: string
    private readonly vnpUrl: string
    private readonly vnpApi: string

    public constructor() {
        this.tmnCode = process.env.VNPAY_TMN_CODE!
        this.secretKey = process.env.VNPAY_HASH_SECRET!
        this.returnUrl = process.env.VNPAY_RETURN_URL!
        this.vnpUrl = process.env.VNPAY_URL!
        this.vnpApi = process.env.VNPAY_API!
    }

    public async pay(input: PayRequestDto): Promise<string> {
        process.env.TZ = 'Asia/Ho_Chi_Minh'

        const date = new Date()
        const createDate = moment(date).format('YYYYMMDDHHmmss')

        const amount = input.amount
        const orderId = input.orderId
        const locale = 'vn'
        const currCode = 'VND'
        const ipAddress = input.ipAddress

        let vnp_Params: any = {}
        vnp_Params['vnp_Version'] = '2.1.0'
        vnp_Params['vnp_Command'] = 'pay'
        vnp_Params['vnp_TmnCode'] = this.tmnCode
        vnp_Params['vnp_Locale'] = locale
        vnp_Params['vnp_CurrCode'] = currCode
        vnp_Params['vnp_TxnRef'] = orderId
        vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId
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

    public async refund(input: RefundRequestDto): Promise<boolean> {
        process.env.TZ = 'Asia/Ho_Chi_Minh'
        let date = new Date()
        let crypto = require('crypto')
        let vnp_TmnCode = this.tmnCode
        let secretKey = this.secretKey
        let vnp_Api = this.vnpApi
        let vnp_TxnRef = input.orderId
        let vnp_TransactionDate = moment(input.transactionDate).format(
            'YYYYMMDDHHmmss'
        )
        let vnp_Amount = input.amount * 100
        let vnp_TransactionType = '02'
        let vnp_CreateBy = 'aims-system'
        let vnp_RequestId = moment(date).format('HHmmss')
        let vnp_Version = '2.1.0'
        let vnp_Command = 'refund'
        let vnp_OrderInfo = 'Hoan tien GD ma:' + vnp_TxnRef
        let vnp_IpAddr = input.ipAddress
        let vnp_CreateDate = moment(date).format('YYYYMMDDHHmmss')
        let vnp_TransactionNo = '0'
        let data =
            vnp_RequestId +
            '|' +
            vnp_Version +
            '|' +
            vnp_Command +
            '|' +
            vnp_TmnCode +
            '|' +
            vnp_TransactionType +
            '|' +
            vnp_TxnRef +
            '|' +
            vnp_Amount +
            '|' +
            vnp_TransactionNo +
            '|' +
            vnp_TransactionDate +
            '|' +
            vnp_CreateBy +
            '|' +
            vnp_CreateDate +
            '|' +
            vnp_IpAddr +
            '|' +
            vnp_OrderInfo
        let hmac = crypto.createHmac('sha512', secretKey)
        let vnp_SecureHash = hmac
            .update(Buffer.from(data, 'utf-8'))
            .digest('hex')
        let dataObj = {
            vnp_RequestId: vnp_RequestId,
            vnp_Version: vnp_Version,
            vnp_Command: vnp_Command,
            vnp_TmnCode: vnp_TmnCode,
            vnp_TransactionType: vnp_TransactionType,
            vnp_TxnRef: vnp_TxnRef,
            vnp_Amount: vnp_Amount,
            vnp_TransactionNo: vnp_TransactionNo,
            vnp_CreateBy: vnp_CreateBy,
            vnp_OrderInfo: vnp_OrderInfo,
            vnp_TransactionDate: vnp_TransactionDate,
            vnp_CreateDate: vnp_CreateDate,
            vnp_IpAddr: vnp_IpAddr,
            vnp_SecureHash: vnp_SecureHash,
        }

        try {
            const result: AxiosResponse = await axios.post(vnp_Api, dataObj)
            console.log(result.data)
            if (result.data.vnp_ResponseCode != VNPAY_REFUND_CODE.SUCCESS) {
                return false
            }
        } catch (e: any) {
            console.error(`Refund error: ${e.message}`)
            return false
        }

        return true
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

export const VNPAY_REFUND_CODE = {
    SUCCESS: '00',
    INVALID_TMN_CODE: '02',
    INVALID_FORMAT: '03',
    TXN_NOT_FOUND: '91',
    REFUND_INPROGRESS: '94',
    VNPAY_FAIL: '95',
    INVALID_CHECKSUM: '97',
    OTHERS_ERROR: '99',
}
