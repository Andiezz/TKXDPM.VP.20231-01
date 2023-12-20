export interface ITrack {
    id: number | ObjectId | string
    name: string
    duration: number
    cdId: number | ObjectId | string
}
