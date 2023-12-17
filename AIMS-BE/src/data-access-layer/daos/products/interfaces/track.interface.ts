export interface ITrack {
    id: number | ObjectId | string
    artist: string
    recordLabel: string
    genre: string
    releaseDate: Date
    compactDiscId: number | ObjectId | string
}
