import 'dotenv/config'
import Controller from './common/controller.interface'
import { DatabaseConnection } from './db/database.connection'
import MongooseConnection from './db/mongoose.connection'
import ExpressServer from './web-server/express.server'
import { WebServer } from './web-server/web.server'

class App {
    private readonly databaseConnection: DatabaseConnection
    private readonly webServer: WebServer

    constructor(controllers: Controller[]) {
        // THE ORDER OF THESE FUNCTIONS IS IMPORTANT
        this.databaseConnection = new MongooseConnection()
        this.webServer = new ExpressServer(controllers)
        this.webServer.listen()
    }
}

export default App
