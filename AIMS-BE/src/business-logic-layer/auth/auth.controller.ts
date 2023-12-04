import { Request, Response, Router } from 'express'
import * as jwt from 'jsonwebtoken'
import { BaseResponse } from '../../common/base-response'
import Controller from '../../common/controller.interface'
import { UsersDao, UsersMongooseDao } from '../../data-access-layer/daos/users'
import { LoginDto } from '../../dtos/auth.dto'
import { NotAuthenticatedError } from '../../errors'
import { tryCatch } from '../../middlewares/error.middleware'
import * as Validators from '../../middlewares/validators.middleware'
import { compareHash } from '../../utils/security'

export class AuthController implements Controller {
    public readonly path: string = '/auth'
    public readonly router: Router = Router()

    constructor(private readonly usersDao: UsersDao = new UsersMongooseDao()) {
        this.initializeRoutes()
    }

    private initializeRoutes(): void {
        this.router.post(
            `${this.path}/login`,
            Validators.login,
            tryCatch(
                async (
                    req: Request,
                    res: Response
                ): Promise<Response | void> => {
                    const loginDto = <LoginDto>req.body

                    const userDoc = await this.usersDao.findOne({
                        email: loginDto.email,
                    })

                    if (!userDoc) {
                        throw new NotAuthenticatedError(
                            'Invalid email or password'
                        )
                    }

                    const isValidPassword = compareHash(
                        loginDto.password,
                        userDoc.password
                    )
                    if (!isValidPassword) {
                        throw new NotAuthenticatedError(
                            'Invalid email or password'
                        )
                    }

                    const payload = {
                        id: userDoc.id.toString(),
                        email: userDoc.email,
                        name: userDoc.name,
                        role: userDoc.role,
                        status: userDoc.status,
                    }
                    const accessToken = jwt.sign(
                        payload,
                        process.env.ACCESS_TOKEN_SECRET!
                    )

                    return res.json(
                        new BaseResponse().ok('Login successfully', {
                            access_token: accessToken,
                        })
                    )
                }
            )
        )
    }
}
