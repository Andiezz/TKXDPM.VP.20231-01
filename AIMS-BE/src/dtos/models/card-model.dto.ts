import { ObjectId } from "../../utils/types";

export interface Card {
    id: number | ObjectId
    cardCode: string
    owner: string
    cvvCode: string
    dateExpiry: Date
}