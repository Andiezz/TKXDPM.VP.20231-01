import { Request, RequestHandler, Response, Router } from 'express'
import { BaseResponse } from '../../common/base-response'
import Controller from '../../common/controller.interface'
import { USER_ROLE } from '../../configs/enums'
import { UsersDao, UsersMongooseDao } from '../../data-access-layer/daos/users'
import { CreateUserDto, UpdateUserInfoDto } from '../../dtos/users.dto'
import { BadRequestError } from '../../errors'
import { jwtAuthGuard, rolesGuard } from '../../middlewares/auth.middleware'
import { tryCatch } from '../../middlewares/error.middleware'
import * as validators from '../../middlewares/validators.middleware'
import { compareHash, hashData } from '../../utils/security'
import {
    NotificationService,
    RecipientDto,
} from '../../subsystems/notification-service'
import { MailService } from '../../subsystems/notification-service/providers/mail.service'

export class UserManagementController implements Controller {
    public readonly path = '/users'
    public readonly router = Router()
    private usersDao: UsersDao
    private notificationService: NotificationService

    constructor() {
        this.notificationService = MailService.getInstance()
        this.usersDao = new UsersMongooseDao()
        this.ensureAdmin()
        this.initializeRoutes()
    }

    private initializeRoutes(): void {
        this.router.post(
            `${this.path}/create`,
            jwtAuthGuard as RequestHandler,
            rolesGuard([USER_ROLE.ADMIN]) as RequestHandler,
            validators.createUser,
            tryCatch(this.createUser)
        )

        this.router.get(
            `${this.path}/profile`,
            jwtAuthGuard as RequestHandler,
            tryCatch(this.getProfile as RequestHandler)
        )

        this.router.patch(
            `${this.path}/profile/change-password`,
            jwtAuthGuard as RequestHandler,
            rolesGuard([USER_ROLE.ADMIN]) as RequestHandler,
            validators.changePassword,
            tryCatch(this.changeOwnPassword as RequestHandler)
        )

        this.router.patch(
            `${this.path}/profile/:userId`,
            jwtAuthGuard as RequestHandler,
            tryCatch(this.updateProfile as RequestHandler)
        )

        this.router.get(
            `${this.path}/:userId`,
            jwtAuthGuard as RequestHandler,
            rolesGuard([USER_ROLE.ADMIN]) as RequestHandler,
            tryCatch(this.getUser)
        )

        this.router.get(
            `${this.path}`,
            jwtAuthGuard as RequestHandler,
            rolesGuard([USER_ROLE.ADMIN]) as RequestHandler,
            tryCatch(this.geUserList)
        )

        this.router.patch(
            `${this.path}/:userId`,
            jwtAuthGuard as RequestHandler,
            rolesGuard([USER_ROLE.ADMIN]) as RequestHandler,
            tryCatch(this.updateUserInfo)
        )

        this.router.delete(
            `${this.path}/:userId`,
            jwtAuthGuard as RequestHandler,
            rolesGuard([USER_ROLE.ADMIN]) as RequestHandler,
            tryCatch(this.deleteUser)
        )

        this.router.patch(
            `${this.path}/change-password/:userId`,
            jwtAuthGuard as RequestHandler,
            rolesGuard([USER_ROLE.ADMIN]) as RequestHandler,
            validators.changePassword,
            tryCatch(this.changePassword)
        )

        this.router.patch(
            `${this.path}/change-status/:userId`,
            jwtAuthGuard as RequestHandler,
            rolesGuard([USER_ROLE.ADMIN]) as RequestHandler,
            tryCatch(this.changeStatus)
        )
    }

    private ensureAdmin = async (): Promise<void> => {
        const isAdminExist = await this.usersDao.findOne({
            role: USER_ROLE.ADMIN,
        })

        if (!isAdminExist) {
            await this.usersDao.seedAdmin()
        }
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

        const recipient = new RecipientDto(createUserDto.email)
        this.notificationService.pushNewUserAccount(recipient)

        return res.json(new BaseResponse().ok('Create new user account'))
    }

    private geUserList = async (
        req: Request,
        res: Response
    ): Promise<Response | void> => {
        const userDocs = await this.usersDao.findAll()

        return res.json(
            new BaseResponse().ok('Fetched user info', {
                user_list: userDocs,
            })
        )
    }

    private getUser = async (
        req: Request,
        res: Response
    ): Promise<Response | void> => {
        const { userId } = req.params

        const userDoc = await this.usersDao.findById(userId)
        if (!userDoc) {
            throw new BadRequestError('User not found')
        }

        const { password, ...userInfoRes } = userDoc

        return res.json(
            new BaseResponse().ok('Fetched user info', {
                user_info: userInfoRes,
            })
        )
    }

    private updateUserInfo = async (
        req: Request,
        res: Response
    ): Promise<Response | void> => {
        const { userId } = req.params
        const updateUserInfoDto = <UpdateUserInfoDto>req.body

        const userDoc = await this.usersDao.findById(userId)
        if (!userDoc) {
            throw new BadRequestError('User not found')
        }

        await this.usersDao.updateInfo(userId, updateUserInfoDto)

        const recipient = new RecipientDto(userDoc.email)
        this.notificationService.pushUserInfoChangesNotification(recipient)

        return res.json(new BaseResponse().ok('Updated user info'))
    }

    private deleteUser = async (
        req: Request,
        res: Response
    ): Promise<Response | void> => {
        const { userId } = req.params

        const userDoc = await this.usersDao.findById(userId)

        if (!userDoc) {
            throw new BadRequestError('User not found')
        }

        if (userDoc.role == USER_ROLE.ADMIN) {
            throw new BadRequestError('Cant delete admin account')
        }

        await this.usersDao.delete(userId)

        const recipient = new RecipientDto(userDoc.email)
        this.notificationService.pushUserInfoChangesNotification(recipient)

        return res.json(new BaseResponse().ok('Deleted user account'))
    }

    private changePassword = async (
        req: Request,
        res: Response
    ): Promise<Response | void> => {
        const { userId } = req.params
        const { oldPassword, newPassword } = req.body
        const userDoc = await this.usersDao.findById(userId)

        if (!userDoc) {
            throw new BadRequestError('User not found')
        }

        const isValidOldPassword = compareHash(oldPassword, userDoc.password)

        if (!isValidOldPassword) {
            throw new BadRequestError('Wrong old password')
        }
        const newHashedPassword = hashData(newPassword)
        await this.usersDao.changePassword(userId, newHashedPassword)

        const recipient = new RecipientDto(userDoc.email)
        this.notificationService.pushUserInfoChangesNotification(recipient)

        return res.json(new BaseResponse().ok('Changed password successfully'))
    }

    private changeStatus = async (
        req: Request,
        res: Response
    ): Promise<Response | void> => {
        const { userId } = req.params

        const userDoc = await this.usersDao.findById(userId)

        if (!userDoc) {
            throw new BadRequestError('User not found')
        }

        await this.usersDao.changeStatus(userId)

        const recipient = new RecipientDto(userDoc.email)
        this.notificationService.pushUserInfoChangesNotification(recipient)

        return res.json(new BaseResponse().ok('Changed status successfully'))
    }

    private getProfile: unknown = async (
        req: CustomRequest,
        res: Response
    ): Promise<Response | void> => {
        const userId = req.user.id

        const userDoc = await this.usersDao.findById(userId)

        if (!userDoc) {
            throw new BadRequestError('User not found')
        }

        const { password, ...result } = userDoc

        return res.json(
            new BaseResponse().ok('Fetched profile infos', { result })
        )
    }

    private updateProfile: unknown = async (
        req: CustomRequest,
        res: Response
    ): Promise<Response | void> => {
        const userId = req.user.id
        const updateProfileDto = <UpdateUserInfoDto>req.body

        const userDoc = await this.usersDao.findById(userId)

        if (!userDoc) {
            throw new BadRequestError('User not found')
        }

        await this.usersDao.updateInfo(userId, updateProfileDto)

        return res.json(new BaseResponse().ok('Updated profile infos'))
    }

    private changeOwnPassword: unknown = async (
        req: CustomRequest,
        res: Response
    ): Promise<Response | void> => {
        const userId = req.user.id

        const { oldPassword, newPassword } = req.body
        const userDoc = await this.usersDao.findById(userId)

        if (!userDoc) {
            throw new BadRequestError('User not found')
        }

        const isValidOldPassword = compareHash(oldPassword, userDoc.password)

        if (!isValidOldPassword) {
            throw new BadRequestError('Wrong old password')
        }
        const newHashedPassword = hashData(newPassword)
        await this.usersDao.changePassword(userId, newHashedPassword)

        return res.json(new BaseResponse().ok('Changed password successfully'))
    }
}
