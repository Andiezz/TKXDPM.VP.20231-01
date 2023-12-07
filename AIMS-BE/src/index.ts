import App from './app'
import { AuthController } from './business-logic-layer/auth/auth.controller'
import { UserManagementController } from './business-logic-layer/user-management/index'

new App([new AuthController(), new UserManagementController()])
