import { hashSync, compareSync } from 'bcrypt'

export const hashData = (data: string): string => {
    const SALT_ROUNDS = 11
    return hashSync(data, SALT_ROUNDS)
}

export const compareHash = (value: string, target: string): boolean => {
    return compareSync(value, target)
}
