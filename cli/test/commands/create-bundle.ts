import BundlesClient from "@staticdeploy/sdk/lib/BundlesClient";
import { expect } from "chai";
import { createTree, destroyTree } from "create-fs-tree";
import { mkdirp, pathExists, readFile, remove, writeFile } from "fs-extra";
import { tmpdir } from "os";
import { join } from "path";
import sinon from "sinon";
import tar from "tar";

import createBundle from "../../src/commands/create-bundle";

describe("deploy command", () => {
    const bundlesCreateStub = sinon.stub(BundlesClient.prototype, "create");
    const targzPath = join(tmpdir(), "staticdeploy-targz-path");
    const unpackingFolder = join(tmpdir(), "staticdeploy-unpacking-folder");
    const targetTree = join(tmpdir(), "staticdeploy-target-tree");
    createTree(targetTree, {
        target: {
            "index.html": "index.html",
            js: {
                "index.js": "index.js"
            }
        },
        "not-a-directory": "not-a-directory"
    });
    const commonOptions = {
        apiUrl: "api-url",
        apiToken: "api-token",
        name: "name",
        tag: "tag",
        description: "description"
    };

    beforeEach(async () => {
        bundlesCreateStub.resetHistory();
        await remove(targzPath);
        await remove(unpackingFolder);
        await mkdirp(unpackingFolder);
    });

    after(async () => {
        bundlesCreateStub.restore();
        await remove(targzPath);
        await remove(unpackingFolder);
        destroyTree(targetTree);
    });

    it("throws an error if the target path is empty", async () => {
        const createPromise = createBundle.handler({
            ...commonOptions,
            from: join(targetTree, "path-to-nothing")
        });
        await expect(createPromise).to.be.rejectedWith(/No directory found at/);
    });

    it("throws error if the target path is not a directory", async () => {
        const createPromise = createBundle.handler({
            ...commonOptions,
            from: join(targetTree, "not-a-directory")
        });
        await expect(createPromise).to.be.rejectedWith(/No directory found at/);
    });

    it("packages the target path into a tar archive", async () => {
        await createBundle.handler({
            ...commonOptions,
            from: join(targetTree, "target")
        });
        const { content } = bundlesCreateStub.getCall(0).args[0];
        await writeFile(targzPath, Buffer.from(content, "base64"));
        await tar.extract({ cwd: unpackingFolder, file: targzPath });
        expect(await pathExists(join(unpackingFolder, "index.html"))).to.equal(
            true
        );
        expect(
            await readFile(join(unpackingFolder, "index.html"), "utf8")
        ).to.equal("index.html");
    });

    it("creates a bundle", async () => {
        await createBundle.handler({
            ...commonOptions,
            from: join(targetTree, "target")
        });
        expect(bundlesCreateStub).to.have.callCount(1);
    });
});
