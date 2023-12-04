import { Request } from 'express'
import { JwtPayload } from 'jsonwebtoken'
export {}
declare global {
    type CustomRequest = Request & { user: CustomJwtPayload }

    JwtPayload
}
