export interface IFile {
    name: string;
    size: number;
    type: string;
    content: Buffer;
    extension: string;
}