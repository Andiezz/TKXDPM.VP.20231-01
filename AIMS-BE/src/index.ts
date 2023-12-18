import App from './app'
import { AuthController } from './business-logic-layer/auth'
import { PaymentController } from './business-logic-layer/payment'
import { UserManagementController } from './business-logic-layer/user-management'

new App([
    new AuthController(),
    new UserManagementController(),
    new PaymentController(),
])
