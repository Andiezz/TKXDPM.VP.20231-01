import { body, query } from 'express-validator'

export const createUser = [
    body('email')
        .exists()
        .withMessage('Email is required')
        .trim()
        .isEmail()
        .withMessage('Invalid email'),
]

export const login = [
    body('email')
        .exists()
        .withMessage('Email is required')
        .trim()
        .isEmail()
        .withMessage('Invalid email'),
    body('password')
        .exists()
        .withMessage('Password is required')
        .trim()
        .isLength({ min: 3 })
        .withMessage('Password must be at least 3 characters long'),
]

export const changePassword = [
    body('oldPassword')
        .isLength({ min: 3 })
        .withMessage('Password must have atleast 3 character long')
        .trim(),
    body('newPassword')
        .isLength({ min: 3 })
        .withMessage('Password must have atleast 3 character long')
        .trim(),
]
