import { Request, RequestHandler, Response, Router } from 'express'
import { BaseResponse } from '../../common/base-response'
import Controller from '../../common/controller.interface'
import { USER_ROLE } from '../../configs/enums'
import { UsersDao, UsersMongooseDao } from '../../data-access-layer/daos/users'
import { CreateUserDto } from '../../dtos/users.dto'
import { BadRequestError } from '../../errors'
import { jwtAuthGuard, rolesGuard } from '../../middlewares/auth.middleware'
import { tryCatch } from '../../middlewares/error.middleware'
import * as validators from '../../middlewares/validators.middleware'
import { hashData } from '../../utils/security'

export class UserManagementController implements Controller {
    public readonly path = '/users'
    public readonly router = Router()
    private usersDao: UsersDao
    constructor() {
        this.usersDao = new UsersMongooseDao()
        this.initializeRoutes()
    }

    private initializeRoutes(): void {
        this.router.post(
            `${this.path}/create`,
            jwtAuthGuard as RequestHandler,
            rolesGuard([USER_ROLE.GOD]) as RequestHandler,
            validators.createUser,
            tryCatch(this.createUser)
        )
    }

    private createUser = async (
        req: Request,
        res: Response
    ): Promise<Response | void> => {
        const createUserDto = <CreateUserDto>req.body

        const isUserExist = await this.usersDao.isExist({
            email: createUserDto.email,
        })
        if (isUserExist) {
            throw new BadRequestError('This email is already registered')
        }
        const hashedPassword = hashData(process.env.DEFAULT_PASSWORD!)

        await this.usersDao.create(createUserDto, hashedPassword)

        return res.json(new BaseResponse().ok('Create new user account'))
    }
}
