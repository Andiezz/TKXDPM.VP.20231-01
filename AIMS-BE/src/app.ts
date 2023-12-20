import express, { Application } from 'express'
import 'dotenv/config'
import Controller from './common/controller.interface'
import MongooseConnection from './db/mongoose.connection'
import ExpressServer from './web-server/express.server'

class App {
    constructor(controllers: Controller[]) {
        // THE ORDER OF THESE FUNCTIONS IS IMPORTANT
        new MongooseConnection()
        const expressServer =  new ExpressServer(controllers)
        expressServer.listen();
    }
}

export default App
