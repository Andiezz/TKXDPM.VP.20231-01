import { ObjectId } from '../../utils/types'

export interface TrackModelDto {
    id: number | ObjectId
    artist: string
    recordLabel: string
    genre: string
    releaseDate: Date
    compactDiscId: number | ObjectId
}
