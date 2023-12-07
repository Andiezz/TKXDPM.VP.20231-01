import { IOrder } from '../../order'
import { ICart } from './cart.interface'


export interface CartDao {
    findById(id: string): Promise<ICart | null>
    // create(createCartDto: IOrder): Promise<boolean>
}
