import { IFile } from "../entities/File";

export default interface IArchiver {
    extractFiles(archive: Buffer): Promise<IFile[]>;
    makeArchive(files: IFile[]): Promise<Buffer>;
}
