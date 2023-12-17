import { ObjectId } from '../../utils/types'

export interface TrackModelDto {
    id: number | ObjectId | string
    artist: string
    recordLabel: string
    genre: string
    releaseDate: Date
    compactDiscId: number | ObjectId | string
}
