export class ArchiveTransactionDto {
    amount: number
    paymentMethod: string
    transactionNo: string
    invoiceId: string
    paymentDate: number

    constructor(
        _paymentMethod: string,
        _amount: number,
        _transactionNo: string,
        _invoiceId: string,
        _paymentDate: number
    ) {
        this.paymentMethod = _paymentMethod
        this.amount = _amount
        this.transactionNo = _transactionNo
        this.invoiceId = _invoiceId
        this.paymentDate = _paymentDate
    }
}
