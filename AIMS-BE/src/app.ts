import express, { Application } from 'express'
import mongoose from 'mongoose'
import 'dotenv/config'
import Controller from './common/controller.interface'
import { ErrorMiddleware } from './middlewares/error.middleware'
import { NotFoundError } from './errors'

class App {
    public readonly express: Application
    public readonly port: number
    public readonly mongodb_uri: string

    constructor(controllers: Controller[]) {
        this.express = express()
        this.port = Number(process.env.PORT) || 8080
        this.mongodb_uri =
            process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tkxdpm'

        // THE ORDER OF THESE FUNCTIONS IS IMPORTANT
        this.initializeDatabaseConnection()
        this.initializeMiddleware()
        this.initializeControllers(controllers)
        this.initializeErrorHandling()
    }

    private initializeDatabaseConnection(): void {
        mongoose
            .connect(this.mongodb_uri)
            .then(() => {
                console.log('[INFO] Database connection established')
            })
            .catch((err) =>
                console.log('[ERROR] Database connection failed: ' + err)
            )
    }

    private initializeMiddleware(): void {
        this.express.use(express.json())
        this.express.use(express.urlencoded({ extended: true }))
    }

    private initializeControllers(controllers: Controller[]): void {
        controllers.forEach((controller: Controller) => {
            this.express.use('/api', controller.router)
        })
    }

    private initializeErrorHandling(): void {
        this.express.all('*', (req, res, next) => {
            throw new NotFoundError()
        })
        this.express.use(ErrorMiddleware)
    }

    public listen(): void {
        this.express.listen(this.port, () => {
            console.log(`[INFO] Application is listening on port ${this.port}`)
        })
    }
}

export default App
