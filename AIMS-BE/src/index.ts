import App from './app'
import { AuthController } from './business-logic-layer/auth/auth.controller'
import { CdTrackController } from './business-logic-layer/cd-track/cd-track.controller'
import { ProductController } from './business-logic-layer/product/product.controller'
import { TrackController } from './business-logic-layer/track'
import { UserManagementController } from './business-logic-layer/user-management/index'

new App([
    new AuthController(),
    new UserManagementController(),
    new ProductController(),
    new TrackController(),
    new CdTrackController()
])
