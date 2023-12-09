export class ContentDto {
    subject: string
    title: string
    message: string

    constructor(_subject: string, _message: string, _title: string) {
        this.subject = _subject
        this.title = _title
        this.message = _message
    }
}
