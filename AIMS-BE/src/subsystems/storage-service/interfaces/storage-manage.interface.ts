import { UploadedFile } from '../dtos/uploaded-file.dto'
import { IFile } from './file.interface'

export interface StorageManage {
    upload(
        file: IFile
    ): Promise<UploadedFile>
}
