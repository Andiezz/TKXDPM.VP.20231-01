import { RequestHandler, Router, Request, Response } from "express"
import Controller from "../../common/controller.interface"
import { TracksDao } from "../../data-access-layer/daos/track/interfaces/tracks.dao.interface"
import { TracksMongooseDao } from "../../data-access-layer/daos/track/providers/tracks.mongoose.dao"
import { jwtAuthGuard, rolesGuard } from "../../middlewares/auth.middleware"
import { USER_ROLE } from "../../configs/enums"
import { tryCatch } from "../../middlewares/error.middleware"
import { CreateTrackDto, QueryTrackDto, UpdateTrackDto } from "../../dtos/tracks.dto"
import { BaseResponse } from "../../common/base-response"


export class TrackController implements Controller {
    public readonly path = '/tracks'
    public readonly router = Router()
    public readonly trackDao: TracksDao

    constructor() {
        this.trackDao = new TracksMongooseDao()
        this.initializeRoutes()
    }

    private initializeRoutes() {
        this.router.post(
            `${this.path}`,
            jwtAuthGuard as RequestHandler,
            rolesGuard([USER_ROLE.ADMIN]) as RequestHandler,
            tryCatch(this.createTrack)
        )

        this.router.patch(
            `${this.path}/:id`,
            jwtAuthGuard as RequestHandler,
            rolesGuard([USER_ROLE.ADMIN]) as RequestHandler,
            tryCatch(this.updateTrack)
        )

        this.router.get(
            `${this.path}/:id`,
            jwtAuthGuard as RequestHandler,
            tryCatch(this.getTrack)
        )

        this.router.get(
            `${this.path}`,
            jwtAuthGuard as RequestHandler,
            tryCatch(this.getTracks)
        )

        this.router.delete(
            `${this.path}/:id`,
            jwtAuthGuard as RequestHandler,
            rolesGuard([USER_ROLE.ADMIN]) as RequestHandler,
            tryCatch(this.deleteTrack)
        )
    }

    private createTrack = async (
        req: Request,
        res: Response
    ): Promise<Response> => {
        const createTrackDto = <CreateTrackDto>req.body

        await this.trackDao.create(createTrackDto)

        return res.json(new BaseResponse().ok('Create track successfully'))
    }

    private updateTrack = async (
        req: Request,
        res: Response
    ): Promise<Response | void> => {
        const updateTrackDto = <UpdateTrackDto>req.body
        const { id } = req.params

        await this.trackDao.update(id, updateTrackDto)

        return res.json(new BaseResponse().ok('Update track successfully'))
    }

    private getTrack = async (
        req: Request,
        res: Response
    ): Promise<Response> => {
        const { id } = req.params

        const track = await this.trackDao.findById(id)
        if (!track) {
            new BaseResponse().fail('Track not found')
        }

        return res.json(
            new BaseResponse().ok('Get track successfully', track)
        )
    }

    private getTracks = async (
        req: Request,
        res: Response
    ): Promise<Response> => {
        const query = <QueryTrackDto>req.query
        const tracks = await this.trackDao.findAll(query)
        if (tracks.length === 0) {
            new BaseResponse().fail('No Track found')
        }

        return res.json(
            new BaseResponse().ok('Get Tracks successfully', tracks)
        )
    }

    private deleteTrack = async (
        req: Request,
        res: Response
    ): Promise<Response> => {
        const { id } = req.params

        const track = await this.trackDao.findById(id)
        if (!track) {
            new BaseResponse().fail('Track not found')
        }

        await this.trackDao.delete(id)

        return res.json(new BaseResponse().ok('Delete track successfully'))
    }
}
