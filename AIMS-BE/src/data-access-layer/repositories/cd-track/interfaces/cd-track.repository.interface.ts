import {
    CdTrackResponse,
    CreateCdTrackDto,
    UpdateCdTrackDto,
} from '../../../../dtos/cd-track.dto'
import { ProductsDao } from '../../../daos/products/interfaces/products.dao.interface'
import { TracksDao } from '../../../daos/track/interfaces/tracks.dao.interface'

export interface CdTrackRepository {
    create(createCdTrackDto: CreateCdTrackDto): Promise<boolean>
    delete(id: string): Promise<boolean>
}
