import { body, query } from 'express-validator'

export const createUser = [
    body('email')
        .exists()
        .withMessage('Email is required')
        .trim()
        .isEmail()
        .withMessage('Invalid email'),
]
