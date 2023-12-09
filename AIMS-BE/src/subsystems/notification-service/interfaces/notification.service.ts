import { ContentDto } from '../dtos/content.dto'
import { RecipientDto } from '../dtos/recipient.dto'
import { SenderDto } from '../dtos/sender.dto'

export interface NotificationService {
    pushNewUserAccount(recipientDto: RecipientDto): void
    pushUserInfoChangesNotification(recipientDto: RecipientDto): void
}
