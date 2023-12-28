import { RecipientDto } from '../dtos/recipient.dto'

export interface NotificationService {
    pushNewUserAccount(recipientDto: RecipientDto): void
    pushUserInfoChangesNotification(recipientDto: RecipientDto): void
    pushOrderDetailsNotification(recipientDto: RecipientDto, id: String): void
    pushOrderPaidNotification(recipientDto: RecipientDto, id: String): void
    pushOrderRefundedNotification(recipientDto: RecipientDto, id: String): void
}
