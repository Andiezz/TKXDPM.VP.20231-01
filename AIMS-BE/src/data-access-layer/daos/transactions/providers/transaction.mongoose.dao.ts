import { Model } from 'mongoose'
import { CreateTransactionDto } from '../../../../dtos/payments.dto'
import { TransactionDao } from '../interfaces/transaction.dao'
import { ITransaction } from '../interfaces/transaction.interface'
import { TransactionModel } from '../schemas/transaction.model'

export class TransactionMongooseDao implements TransactionDao {
    public constructor(
        private readonly txnModel: Model<ITransaction> = TransactionModel.getInstance()
    ) {}

    public async create(
        createTransactionDto: CreateTransactionDto
    ): Promise<ITransaction> {
        const txnDoc = await this.txnModel.create(createTransactionDto)

        const { _id, ...result } = txnDoc.toObject()
        result.id = _id
        return result
    }

    public async updateStatus(txnId: string, status: number): Promise<boolean> {
        const txnDoc = await this.txnModel.findById(txnId)

        if (!txnDoc) {
            return false
        }

        txnDoc.status = status
        await txnDoc.save()

        return true
    }

    public async findByOrderId(orderId: string): Promise<ITransaction | null> {
        const txnDoc = await this.txnModel.findOne({ orderId })
        if (!txnDoc) {
            return null
        }

        const { _id, ...result } = txnDoc.toObject()
        result.id = _id
        return result
    }
}
