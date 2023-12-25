import { BadRequestError } from '../../../errors'
import { UploadedFile } from '../dtos/uploaded-file.dto'
import { IFile } from '../interfaces/file.interface'
import { StorageManage } from '../interfaces/storage-manage.interface'
import { StorageManager } from '../interfaces/storage-manager.interface'
import { FirebaseStorageManager } from './firebase-storage.provider'

export class RemoteStorageManage implements StorageManage {
    constructor(
        private readonly storageManager: StorageManager = new FirebaseStorageManager()
    ) {}

    async upload(file: IFile): Promise<UploadedFile> {
        const uploadedFile = await this.storageManager.upload(file)

        if (!uploadedFile) {
            throw new BadRequestError('File upload failed')
        }

        return uploadedFile
    }
}
