import { NextFunction, Request, RequestHandler, Response } from 'express'
import jwt from 'jsonwebtoken'
import { NotAuthenticatedError } from '../errors'
import { USER_STATUS } from '../configs/constants'

export const jwtAuthGuard: unknown = (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    const auth_header = req.headers['authorization']
    const accessToken = auth_header && auth_header.split(' ')[1]
    if (!accessToken) {
        throw new NotAuthenticatedError('Not authenticated')
    }
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!)

    req.user = decoded

    next()
}

export const rolesGuard = (allowedRoles: string[]) => {
    return (req: CustomRequest, res: Response, next: NextFunction) => {
        if (
            !allowedRoles.includes(req.user.role) ||
            req.user.status != USER_STATUS.ACTIVE
        ) {
            return res.status(401).json({
                status: -501,
                message: 'Access Denied - Unauthorized',
            })
        }
        next()
    }
}
