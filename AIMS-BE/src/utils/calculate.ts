import { PAGINATION_DEFAULT } from "../configs/constants"

export const calculateSkip = (page: number | undefined, limit: number | undefined): number =>{
    return ((Number(page) || PAGINATION_DEFAULT.PAGE) - 1) * (Number(limit) || PAGINATION_DEFAULT.LIMIT)
}