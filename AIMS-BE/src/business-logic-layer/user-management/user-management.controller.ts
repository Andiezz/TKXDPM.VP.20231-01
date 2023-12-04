import { Request, RequestHandler, Response, Router } from 'express'
import Controller from '../../common/controller.interface'

import { tryCatch } from '../../middlewares/error.middleware'
import { CreateUserDto } from '../../dtos/users.dto'
import { UsersDao, UsersMongooseDao } from '../../data-access-layer/daos/users'
import * as Validators from '../../middlewares/validators.middleware'
import { BaseResponse } from '../../common/base-response'
import { BadRequestError } from '../../errors'
import { hashData } from '../../utils/security'
import { jwtAuthGuard, rolesGuard } from '../../middlewares/auth.middleware'
import { USER_ROLE } from '../../configs/enums'

export class UserManagementController implements Controller {
    public readonly path = '/users'
    public readonly router = Router()

    constructor(private readonly usersDao: UsersDao = new UsersMongooseDao()) {
        this.initializeRoutes()
    }

    private initializeRoutes(): void {
        this.router.post(
            `${this.path}/create`,
            jwtAuthGuard as RequestHandler,
            rolesGuard([USER_ROLE.GOD]) as RequestHandler,
            Validators.createUser,
            tryCatch(
                async (
                    req: Request,
                    res: Response
                ): Promise<Response | void> => {
                    const createUserDto = <CreateUserDto>req.body

                    const isUserExist = await this.usersDao.isExist({
                        email: createUserDto.email,
                    })
                    if (isUserExist) {
                        throw new BadRequestError(
                            'This email is already registered'
                        )
                    }
                    const hashedPassword = hashData(
                        process.env.DEFAULT_PASSWORD!
                    )

                    await this.usersDao.create(createUserDto, hashedPassword)

                    return res.json(
                        new BaseResponse().ok('Create new user account')
                    )
                }
            )
        )
    }
}
