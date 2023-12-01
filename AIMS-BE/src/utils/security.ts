import { hashSync } from 'bcrypt'

export const hashData = (data: string): string => {
    const SALT_ROUNDS = 11
    return hashSync(data, SALT_ROUNDS)
}
