import express, { Application } from 'express'
import Controller from '../common/controller.interface'
import { NotFoundError } from '../errors'
import { ErrorMiddleware } from '../middlewares/error.middleware'
import cors from 'cors'
import { WebServer } from './web.server'

class ExpressServer implements WebServer {
    public readonly express: Application
    public readonly port: number
    private readonly CORS_OPTIONS = {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    }

    constructor(controllers: Controller[]) {
        this.express = express()
        this.port = Number(process.env.PORT) || 8080

        // THE ORDER OF THESE FUNCTIONS IS IMPORTANT
        this.initializeMiddleware()
        this.initializeControllers(controllers)
        this.initializeErrorHandling()
    }

    private initializeMiddleware(): void {
        this.express.set('view engine', 'ejs')
        this.express.use(cors(this.CORS_OPTIONS))
        this.express.use(express.static('public'))
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

export default ExpressServer
