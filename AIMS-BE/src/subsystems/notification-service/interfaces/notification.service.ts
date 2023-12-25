import { RecipientDto } from '../dtos/recipient.dto'

export interface NotificationService {
    pushNewUserAccount(recipientDto: RecipientDto): void
    pushUserInfoChangesNotification(recipientDto: RecipientDto): void
    sendMailDetailOrder(recipientDto: RecipientDto, id: String): void
}
