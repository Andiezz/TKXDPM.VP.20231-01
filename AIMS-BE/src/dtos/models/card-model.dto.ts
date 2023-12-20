
export interface Card {
    id: number | ObjectId | string
    cardCode: string
    owner: string
    cvvCode: string
    dateExpiry: Date
}