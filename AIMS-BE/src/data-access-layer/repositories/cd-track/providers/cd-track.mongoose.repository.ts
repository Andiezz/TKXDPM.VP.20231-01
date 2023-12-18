import { KIND } from '../../../../configs/enums'
import {
    CdTrackResponse,
    CreateCdTrackDto,
    UpdateCdTrackDto,
} from '../../../../dtos/cd-track.dto'
import { ProductsDao } from '../../../daos/products/interfaces/products.dao.interface'
import ProductDaoFactory from '../../../daos/products/product.dao.factory'
import { TracksDao } from '../../../daos/track/interfaces/tracks.dao.interface'
import { TracksMongooseDao } from '../../../daos/track/providers/tracks.mongoose.dao'
import { CdTrackRepository } from '../interfaces/cd-track.repository.interface'

export class CdTrackMongooseRepository implements CdTrackRepository {
    private readonly cdDao: ProductsDao
    private readonly trackDao: TracksDao

    constructor() {
        this.cdDao = new ProductDaoFactory().getInstance(KIND.CD)
        this.trackDao = new TracksMongooseDao()
    }

    public async create(createCdTrackDto: CreateCdTrackDto): Promise<boolean> {
        const cd = createCdTrackDto.cd
        const tracks = createCdTrackDto.tracks
        const cdId = await this.cdDao.create(cd)
        tracks.forEach((track) => {
            track.cdId = cdId
        })
        await this.trackDao.createMany(tracks)
        return true
    }

    public async delete(cdId: string): Promise<boolean> {
        const [trackDeleteResult, cdDeleteResult] = await Promise.all([
            this.trackDao.deleteByCdId(cdId),
            this.cdDao.delete(cdId),
        ])
        return trackDeleteResult && cdDeleteResult
    }
}
