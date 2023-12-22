import { IProduct } from "../data-access-layer/daos/products/interfaces/product.interface";
import { ITrack } from "../data-access-layer/daos/track/interfaces/track.interface";

export type CreateCdTrackDto = {
    cd: Omit<IProduct, 'id'>
    tracks: Array<Omit<ITrack, 'id'>>
}
export type UpdateCdTrackDto = Omit<IProduct, 'id'> & Array<Omit<ITrack, 'id'>>
export type CdTrackResponse = Omit<IProduct, 'id'> & Array<Omit<ITrack, 'id'>>