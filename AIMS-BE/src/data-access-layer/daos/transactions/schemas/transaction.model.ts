import { Model, Schema, model } from 'mongoose'
import { ITransaction } from '../interfaces/transaction.interface'
import { PAYMENT_METHOD } from '../../../../subsystems/payment-service'
import { TRANSACTION_STATUS } from '../../../../configs/constants'

/**
 * The Singleton class defines the `getInstance` method that lets clients access
 * the unique singleton instance.
 */
export class TransactionModel {
    private static instance: Model<ITransaction>

    /**
     * The Singleton's constructor should always be private to prevent direct
     * construction calls with the `new` operator.
     */
    private constructor() {}

    /**
     * The static method that controls the access to the singleton instance.
     *
     * This implementation let you subclass the Singleton class while keeping
     * just one instance of each subclass around.
     */
    public static getInstance(): Model<ITransaction> {
        if (!TransactionModel.instance) {
            const transactionSchema = new Schema<ITransaction>(
                {
                    status: {
                        type: Number,
                        default: TRANSACTION_STATUS.PENDING,
                    },
                    invoiceId: {
                        type: String,
                        required: true,
                    },
                    paymentMethod: {
                        type: String,
                        required: true,
                    },
                    amount: {
                        type: Number,
                        required: true,
                    },
                    currency: {
                        type: String,
                        required: true,
                    },
                    paymentDate: {
                        type: Number,
                        required: true,
                    },
                    content: String,
                },
                { timestamps: true }
            )

            TransactionModel.instance = model('Transaction', transactionSchema)
        }

        return TransactionModel.instance
    }
}
