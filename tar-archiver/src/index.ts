import {
    ArchiveCreationError,
    ArchiveExtractionError,
    IArchiver,
    IFile,
} from "@staticdeploy/core";
import { map } from "bluebird";
import { mkdirp, outputFile, readFile, remove } from "fs-extra";
import { tmpdir } from "os";
import { join } from "path";
import recursiveReaddir from "recursive-readdir";
import tar from "tar";

import getRandomString from "./getRandomString";
import removePrefix from "./removePrefix";

interface ITarArchiver extends IArchiver {
    makeArchiveFromPath(path: string): Promise<Buffer>;
}

const tarArchiver: ITarArchiver = {
    async extractFiles(archive: Buffer): Promise<IFile[]> {
        const workingDirectoryPath = join(tmpdir(), getRandomString());
        const stagingDirectoryPath = join(workingDirectoryPath, "staging");
        const tarArchivePath = join(workingDirectoryPath, "archive.tar.gz");
        try {
            await mkdirp(workingDirectoryPath);
            await outputFile(tarArchivePath, archive);
            await mkdirp(stagingDirectoryPath);
            await tar.extract({
                cwd: stagingDirectoryPath,
                file: tarArchivePath,
            });
            const localPaths = await recursiveReaddir(stagingDirectoryPath);
            return map(localPaths, async (localPath) => {
                const path = removePrefix(localPath, stagingDirectoryPath);
                return {
                    path: path,
                    content: await readFile(join(stagingDirectoryPath, path)),
                };
            });
        } catch (err) {
            throw new ArchiveExtractionError();
        } finally {
            await remove(workingDirectoryPath);
        }
    },

    async makeArchive(files: IFile[]): Promise<Buffer> {
        const workingDirectoryPath = join(tmpdir(), getRandomString());
        const stagingDirectoryPath = join(workingDirectoryPath, "staging");
        const tarArchivePath = join(workingDirectoryPath, "archive.tar.gz");
        try {
            await mkdirp(workingDirectoryPath);
            await map(files, (file) =>
                outputFile(join(stagingDirectoryPath, file.path), file.content)
            );
            await tar.create(
                {
                    cwd: stagingDirectoryPath,
                    file: tarArchivePath,
                    gzip: true,
                    portable: true,
                },
                ["."]
            );
            return readFile(tarArchivePath);
        } catch (err) {
            throw new ArchiveCreationError();
        } finally {
            await remove(workingDirectoryPath);
        }
    },

    async makeArchiveFromPath(path: string): Promise<Buffer> {
        const workingDirectoryPath = join(tmpdir(), getRandomString());
        const tarArchivePath = join(workingDirectoryPath, "archive.tar.gz");
        try {
            await mkdirp(workingDirectoryPath);
            await tar.create(
                {
                    cwd: path,
                    file: tarArchivePath,
                    gzip: true,
                    portable: true,
                },
                ["."]
            );
            return readFile(tarArchivePath);
        } catch (err) {
            throw new ArchiveCreationError();
        } finally {
            await remove(workingDirectoryPath);
        }
    },
};
export default tarArchiver;
