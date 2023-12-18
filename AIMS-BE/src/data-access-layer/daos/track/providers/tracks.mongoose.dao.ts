import { Model } from 'mongoose'
import { ITrack } from '../interfaces/track.interface'
import { TracksDao } from '../interfaces/tracks.dao.interface'
import { TrackModel } from '../schemas/tracks.model'
import {
    CreateTrackDto,
    QueryTrackDto,
    UpdateTrackDto,
} from '../../../../dtos/tracks.dto'
import { ObjectId } from 'mongodb'
import { BadRequestError } from '../../../../errors'
import {
    PAGINATION_DEFAULT,
    PAGINATION_SORT,
} from '../../../../configs/constants'
import { calculateSkip } from '../../../../utils/calculate'
import { IProduct } from '../../products/interfaces/product.interface'
import { ProductModel } from '../../products/schemas/product.model'

export class TracksMongooseDao implements TracksDao {
    constructor(private trackModel: Model<ITrack> = TrackModel.getInstance()) {}

    public async create(createTrackDto: CreateTrackDto): Promise<boolean> {
        await this.trackModel.create(createTrackDto)
        return true
    }

    public async update(
        id: string,
        updateTrackDto: UpdateTrackDto
    ): Promise<boolean> {
        const trackDoc = await this.trackModel.findById(id)
        if (!trackDoc) {
            throw new BadRequestError('Track is not existed')
        }

        await this.trackModel.findByIdAndUpdate(
            new ObjectId(id),
            updateTrackDto
        )

        return true
    }

    public async findById(id: string): Promise<ITrack | null> {
        const trackDoc = await this.trackModel
            .findById(id)
            .populate('cdId', null, ProductModel.getInstance())
        if (!trackDoc) {
            return null
        }

        const { _id, ...result } = trackDoc.toObject()
        result.id = _id
        return result
    }

    public async findAll(query: QueryTrackDto): Promise<ITrack[]> {
        let { keyword, limit, page, sortBy, sortOrder, cdId } = query

        //set default values
        !limit && (limit = PAGINATION_DEFAULT.LIMIT)
        !page && (page = PAGINATION_DEFAULT.PAGE)
        !sortBy && (sortBy = PAGINATION_SORT.SORT_BY)
        !sortOrder && (sortOrder = PAGINATION_SORT.ASC)

        const skip = calculateSkip(page, limit)

        const matchFilters: any = {}
        if (keyword) {
            matchFilters['$or'] = [
                { id: { $regex: keyword, $options: 'i' } },
                { artist: { $regex: keyword, $options: 'i' } },
                { recordLabel: { $regex: keyword, $options: 'i' } },
            ]
        }
        cdId && (matchFilters['cdIdStr'] = cdId)

        const results = (await this.trackModel.aggregate([
            {
                $set: {
                    id: {
                        $toString: '$_id',
                    },
                    cdIdStr: {
                        $toString: '$cdId',
                    }
                },
            },
            {
                $match: matchFilters,
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'cdId',
                    foreignField: '_id',
                    as: 'cd',
                },
            },
            {
                $facet: {
                    paginatedResults: [
                        { $skip: skip },
                        { $limit: limit as number },
                    ],
                    totalCount: [{ $count: 'count' }],
                },
            },
            {
                $set: {
                    page,
                    limit,
                    total: { $first: '$totalCount.count' },
                    current: { $size: '$paginatedResults' },
                },
            },
            {
                $unset: ['totalCount'],
            },
        ])) as ITrack[]

        return results
    }

    public async delete(id: string): Promise<boolean> {
        const trackDoc = await this.trackModel.findById(id)
        if (!trackDoc) {
            throw new BadRequestError('Product is not existed')
        }

        await this.trackModel.findByIdAndDelete(new ObjectId(id))

        return true
    }
}
