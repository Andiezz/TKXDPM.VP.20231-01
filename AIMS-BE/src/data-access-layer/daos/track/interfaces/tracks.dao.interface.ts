import { CreateTrackDto, QueryTrackDto, UpdateTrackDto } from "../../../../dtos/tracks.dto"
import { ITrack } from "./track.interface"

export interface TracksDao {
    create(createTrackDto: CreateTrackDto): Promise<boolean>
    createMany(createTrackDtos: Array<CreateTrackDto>): Promise<boolean>
    update(id: string, updateTrackDto: UpdateTrackDto): Promise<boolean>
    findById(id: string): Promise<ITrack | null>
    findAll(query: QueryTrackDto): Promise<ITrack[]>
    delete(id: string): Promise<boolean>
    deleteByCdId(cdId: string): Promise<boolean>
}
