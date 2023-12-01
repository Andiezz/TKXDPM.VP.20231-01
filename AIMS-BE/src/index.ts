import App from './app'
import { UserManagementController } from './business-logic/user-management/index'

const app = new App([new UserManagementController()])

app.listen()
