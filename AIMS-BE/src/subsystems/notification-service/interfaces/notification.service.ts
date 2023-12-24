import { RecipientDto } from '../dtos/recipient.dto'

export interface NotificationService {
    pushNewUserAccount(recipientDto: RecipientDto): Promise<void>
    pushUserInfoChangesNotification(recipientDto: RecipientDto): Promise<void>
}
