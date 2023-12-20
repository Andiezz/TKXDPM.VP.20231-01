import { ITrack } from '../data-access-layer/daos/track/interfaces/track.interface'
import { IPaginationDto } from './pagination.dto'

export type CreateTrackDto = Omit<ITrack, 'id'>
export type UpdateTrackDto = Omit<ITrack, 'id'>
export type QueryTrackDto = IPaginationDto & { keyword?: string; cdId?: string }
