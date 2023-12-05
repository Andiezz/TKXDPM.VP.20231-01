import { Request } from 'express'
import { JwtPayload } from 'jsonwebtoken'
import { Types } from 'mongoose'
export {}
declare global {
    type CustomRequest = Request & { user: CustomJwtPayload }
    type ObjectId = Types.ObjectId
    JwtPayload
}
