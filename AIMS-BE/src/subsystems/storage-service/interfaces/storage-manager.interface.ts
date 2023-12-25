import { UploadedFile } from '../dtos/uploaded-file.dto'
import { IFile } from './file.interface'

export interface StorageManager {
    upload(
        file: IFile
    ): Promise<UploadedFile | undefined>
}
