import { Request, Response, NextFunction } from 'express'
import { IFile } from '../subsystems/storage-service/interfaces/file.interface'
import multer from 'multer'

export const fileHandler = (req: Request, _: Response, next: NextFunction) => {
    const file: Express.Multer.File | undefined = req.file
    if (!file) return next()
    const mappedFile: IFile = {
        name: file.originalname,
        type: file.mimetype,
        content: file.buffer,
        size: file.size,
        extension: `${file.originalname.split('.').pop()}`,
    }
    Object.assign(req.body, { file: mappedFile })
    return next()
}
