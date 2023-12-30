import mongoose from 'mongoose'
import { DatabaseConnection } from './database.connection'

class MongooseConnection implements DatabaseConnection {
    public readonly mongodbUri: string

    constructor() {
        this.mongodbUri =
            process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tkxdpm'

        this.initializeDatabaseConnection()
    }

    private initializeDatabaseConnection(): void {
        mongoose
            .connect(this.mongodbUri)
            .then(() => {
                console.log('[INFO] Database connection established')
            })
            .catch((err) =>
                console.log('[ERROR] Database connection failed: ' + err)
            )
    }
}

export default MongooseConnection
