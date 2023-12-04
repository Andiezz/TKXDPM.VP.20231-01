import App from './app'
import { UserManagementController } from './business-logic-layer/user-management/index'

const app = new App([new UserManagementController()])

app.listen()
