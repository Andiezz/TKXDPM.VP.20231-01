import { Request, Response, Router } from 'express'
import Controller from '../../common/controller.interface'

import { tryCatch } from '../../middlewares/error.middleware'
import { CreateUserDto } from '../../dtos/users.dto'
import { UsersDao, UsersMongooseDao } from '../../daos/users'
import * as Validtors from '../../middlewares/validators.middleware'
import { BaseResponse } from '../../common/base-response'

export class UserManagementController implements Controller {
    public readonly path = '/users'
    public readonly router = Router()

    constructor(private readonly usersDao: UsersDao = new UsersMongooseDao()) {
        this.initializeRoutes()
    }

    private initializeRoutes(): void {
        this.router.post(
            `${this.path}/create`,
            Validtors.createUser,
            tryCatch(
                async (
                    req: Request,
                    res: Response
                ): Promise<Response | void> => {
                    const createUserDto = <CreateUserDto>req.body
                    await this.usersDao.create(createUserDto)

                    return res.json(
                        new BaseResponse().ok('Create new user account')
                    )
                }
            )
        )
    }
}
