import { ValidationChain, body, param } from 'express-validator'
import { SUPPORTED_CURRENCY } from '../configs/enums'

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

export const payRequest = [
    body('orderId').exists().withMessage('Order id is required'),
    body('paymentMethod').exists().withMessage('Payment method is required'),
    body('amount')
        .exists()
        .withMessage('Amount is required')
        .isNumeric()
        .withMessage('Amount must be a numeric value'),
    body('currency')
        .exists()
        .withMessage('Currency is required')
        .isIn([SUPPORTED_CURRENCY.VND, SUPPORTED_CURRENCY.USD])
        .withMessage('Unsupported currency'),
]

// export const captureTxnRequest = [
//     body('orderId').exists().withMessage('Order id is required'),
//     body('paymentMethod').exists().withMessage('Payment method is required'),
//     body('amount')
//         .exists()
//         .withMessage('Amount is required')
//         .isNumeric()
//         .withMessage('Amount must be a numeric value'),
//     ,
//     body('currency').exists().withMessage('Currency is required'),
// .isIn([SUPPORTED_CURRENCY.VND, SUPPORTED_CURRENCY.USD])
// .withMessage('Unsupported currency'),
// ]

export const refundRequest = [
    param('orderId').exists().withMessage('Order id is required'),
]
