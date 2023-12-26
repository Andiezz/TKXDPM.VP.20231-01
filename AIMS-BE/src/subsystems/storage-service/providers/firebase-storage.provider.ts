import { FIREBASE_CONFIG } from '../../../configs/storage.config'
import { UploadedFile } from '../dtos/uploaded-file.dto'
import { IFile } from '../interfaces/file.interface'
import { StorageManager } from '../interfaces/storage-manager.interface'
import { FirebaseApp, initializeApp } from 'firebase/app'
import {
    FirebaseStorage,
    getDownloadURL,
    getStorage,
    ref,
    uploadBytes,
} from 'firebase/storage'

export class FirebaseStorageManager implements StorageManager {
    private static app: FirebaseApp
    private static storage: FirebaseStorage

    constructor() {
        FirebaseStorageManager.app = initializeApp(FIREBASE_CONFIG)
        FirebaseStorageManager.storage = getStorage(FirebaseStorageManager.app)
    }

    async upload(file: IFile): Promise<UploadedFile | undefined> {
        const storageRef = ref(
            FirebaseStorageManager.storage,
            'images/' + this.generateFileName(file, Date.now())
        )

        const metadata = {
            contentType: file.type,
        }
        const buffer = Buffer.from(file.content)
        const uploadTask = await uploadBytes(storageRef, buffer, metadata)

        const downloadURL = await getDownloadURL(uploadTask.ref)

        return { path: downloadURL }
    }

    generateFileName(file: IFile, timestamp: number): string {
        return `${file.name}-${timestamp}.${file.extension}`
    }
}
