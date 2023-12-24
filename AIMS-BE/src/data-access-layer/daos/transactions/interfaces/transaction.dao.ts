import { CreateTransactionDto } from '../../../../dtos/payments.dto'
import { ITransaction } from './transaction.interface'

export interface TransactionDao {
    create(createTransactionDto: CreateTransactionDto): Promise<ITransaction>

    updateStatus(txnId: string, status: number): Promise<boolean>

    findByOrderId(orderId: string): Promise<ITransaction | null>
}
