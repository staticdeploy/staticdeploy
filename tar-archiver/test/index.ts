import { expect } from "chai";
import { createTree, destroyTree } from "create-fs-tree";
import { tmpdir } from "os";
import { join } from "path";

import tarArchiver from "../src";
import getRandomString from "../src/getRandomString";

describe("ITarArchiver", () => {
    it("extractFiles(makeArchive(files)) = files", async () => {
        const files = [
            { path: "/file", content: Buffer.from("/file") },
            { path: "/nested/file", content: Buffer.from("/nested/file") },
            {
                path: "/deeply/nested/file",
                content: Buffer.from("/deeply/nested/file")
            }
        ];
        const archive = await tarArchiver.makeArchive(files);
        const extractedFiles = await tarArchiver.extractFiles(archive);
        expect(extractedFiles).to.deep.equalInAnyOrder(files);
    });

    it("extractFiles(makeArchiveFromPath(path)) = files @ path", async () => {
        const directoryToArchivePath = join(tmpdir(), getRandomString());
        createTree(directoryToArchivePath, {
            file: "/file",
            nested: { file: "/nested/file" },
            deeply: { nested: { file: "/deeply/nested/file" } }
        });
        const archive = await tarArchiver.makeArchiveFromPath(
            directoryToArchivePath
        );
        destroyTree(directoryToArchivePath);
        const extractedFiles = await tarArchiver.extractFiles(archive);
        expect(extractedFiles).to.deep.equalInAnyOrder([
            { path: "/file", content: Buffer.from("/file") },
            { path: "/nested/file", content: Buffer.from("/nested/file") },
            {
                path: "/deeply/nested/file",
                content: Buffer.from("/deeply/nested/file")
            }
        ]);
    });
});
