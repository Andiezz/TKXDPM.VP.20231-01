import nodemailer, { Transporter } from 'nodemailer'
import { RecipientDto } from '../dtos/recipient.dto'
import { NotificationService } from '../interfaces/notification.service'

export class MailService implements NotificationService {
    private static instance: MailService
    private transporter?: Transporter

    private constructor() {}

    public static getInstance() {
        if (!MailService.instance) {
            MailService.instance = new MailService()

            this.instance.transporter = nodemailer.createTransport({
                service: 'Gmail', // Use your email service
                auth: {
                    user: process.env.NODE_MAILER_EMAIL, // Your email address
                    pass: process.env.NODE_MAILER_APP_PASSWORD, // Your password
                },
            })
        }
        return MailService.instance
    }

    public async pushUserInfoChangesNotification(
        recipientDto: RecipientDto
    ): Promise<void> {
        // Set email options
        const mailOptions = {
            from: process.env.NODE_MAILER_EMAIL, // Sender
            to: recipientDto.recipient, // Recipient
            subject: 'Security Warning', // Email subject
            html: `<!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <title>AIMS</title>
            </head>
            <body>
              <h1>AIMS</h1>
              <p>There are changes with your user account info.</p>
              <p>Please contact your admin for more details.</p>
            </body>
            </html> `,
        }

        this.sendMail(mailOptions)
    }

    public async pushNewUserAccount(recipientDto: RecipientDto): Promise<void> {
        const mailOptions = {
            from: process.env.NODE_MAILER_EMAIL, // Sender
            to: recipientDto.recipient, // Recipient
            subject: 'Welcome to AIMS', // Email subject
            html: `<!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <title>AIMS</title>
            </head>
            <body>
              <h1>AIMS</h1>
              <p>You are added as manager of AIMS system.</p>
              <p>Login with this account:</p>
              <p>- username: ${recipientDto.recipient}</p>
              <p>- password: ${process.env.DEFAULT_PASSWORD}</p>
              <p>Please change your password</p>
              <p>Thank you for joining AIMS. Looking forward to work with you.</p>
            </body>
            </html> `,
        }

        this.sendMail(mailOptions)
    }

    public pushOrderDetailsNotification(
        recipientDto: RecipientDto,
        id: String
    ): void {
        const mailOptions = {
            from: process.env.NODE_MAILER_EMAIL, // Sender
            to: recipientDto.recipient, // Recipient
            subject: 'Place Order Successfully', // Email subject
            html: `<!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <title>AIMS</title>
            </head>
            <body>
              <h1>AIMS</h1>
              <p>Thank you for shopping at AIMS. Your order has been confirmed and is being processed</p>
              <strong>- Order Number:</strong> ${id}<br>
              <strong>- Order Details: </strong> 
              <a href="http://localhost:5173/order/${id}"> Click Here</a>
              <p>We sincerely thank you and look forward to serving you in your next purchases!</p>
            </body>
            </html> `,
        }
        this.sendMail(mailOptions)
    }

    public pushOrderPaidNotification(
        recipientDto: RecipientDto,
        id: String
    ): void {
        const mailOptions = {
            from: process.env.NODE_MAILER_EMAIL, // Sender
            to: recipientDto.recipient, // Recipient
            subject: 'Order Paid Successfully', // Email subject
            html: `<!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <title>AIMS</title>
            </head>
            <body>
              <h1>AIMS</h1>
              <p>Thank you for shopping at AIMS. Your order has been paid</p>
              <strong>- Order Number:</strong> ${id}<br>
              <strong>- Order Details: </strong> 
              <a href="http://localhost:5173/order/${id}"> Click Here</a>
              <p>We sincerely thank you and look forward to serving you in your next purchases!</p>
            </body>
            </html> `,
        }
        this.sendMail(mailOptions)
    }

    public pushOrderRefundedNotification(
        recipientDto: RecipientDto,
        id: String
    ): void {
        const mailOptions = {
            from: process.env.NODE_MAILER_EMAIL, // Sender
            to: recipientDto.recipient, // Recipient
            subject: 'Order Refunded Successfully', // Email subject
            html: `<!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <title>AIMS</title>
            </head>
            <body>
              <h1>AIMS</h1>
              <p>Thank you for shopping at AIMS. Your order has been refunded</p>
              <strong>- Order Number:</strong> ${id}<br>
              <strong>- Order Details: </strong> 
              <a href="http://localhost:5173/order/${id}"> Click Here</a>
              <p>We sincerely thank you and look forward to serving you in your next purchases!</p>
            </body>
            </html> `,
        }
        this.sendMail(mailOptions)
    }

    private sendMail(mailOptions: Object): void {
        // Send the email
        this.transporter?.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Email sending failed:', error)
            } else {
                console.log('Email sent: ' + info.response)
            }
        })
    }
}
