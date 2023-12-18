import { CreateTransactionDto } from '../../../../dtos/payments.dto'
import { TransactionDao } from '../interfaces/transaction.dao'
import { ITransaction } from '../interfaces/transaction.interface'
import { TransactionModel } from '../schemas/transaction.model'
import { Document, ObjectId } from 'mongodb'

export class TransactionMongooseDao implements TransactionDao {
    constructor(private txnModel: Document = TransactionModel.getInstance()) {}

    async create(
        createTransactionDto: CreateTransactionDto
    ): Promise<ITransaction> {
        const txnDoc = await this.txnModel.create(createTransactionDto)

        const { _id, ...result } = txnDoc.toObject()
        result.id = _id
        return result
    }

    async updateStatus(txnId: string, status: number): Promise<void> {
        const txnDoc = await this.txnModel.findById(txnId)

        txnDoc.status = status
        await txnDoc.save()
    }
}
