import DeploymentsClient from "@staticdeploy/sdk/lib/DeploymentsClient";
import { expect } from "chai";
import { createTree, destroyTree } from "create-fs-tree";
import { mkdirp, pathExists, readFile, remove, writeFile } from "fs-extra";
import { tmpdir } from "os";
import { join } from "path";
import sinon = require("sinon");
import tar = require("tar");

import deploy from "../../src/commands/deploy";

describe("deploy command", () => {
    const deploymentsCreateStub = sinon.stub(
        DeploymentsClient.prototype,
        "create"
    );
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
        app: "app",
        entrypoint: "entrypoint",
        description: "description"
    };

    beforeEach(async () => {
        deploymentsCreateStub.resetHistory();
        await remove(targzPath);
        await remove(unpackingFolder);
        await mkdirp(unpackingFolder);
    });

    after(async () => {
        deploymentsCreateStub.restore();
        await remove(targzPath);
        await remove(unpackingFolder);
        destroyTree(targetTree);
    });

    it("throws an error if the target path is empty", async () => {
        const deployPromise = deploy.handler({
            ...commonOptions,
            target: join(targetTree, "path-to-nothing")
        });
        await expect(deployPromise).to.be.rejectedWith(/No directory found at/);
    });

    it("throws error if the target path is not a directory", async () => {
        const deployPromise = deploy.handler({
            ...commonOptions,
            target: join(targetTree, "not-a-directory")
        });
        await expect(deployPromise).to.be.rejectedWith(/No directory found at/);
    });

    it("packages the target path into a tar archive", async () => {
        await deploy.handler({
            ...commonOptions,
            target: join(targetTree, "target")
        });
        const { content } = deploymentsCreateStub.getCall(0).args[0];
        await writeFile(targzPath, Buffer.from(content, "base64"));
        await tar.extract({ cwd: unpackingFolder, file: targzPath });
        expect(await pathExists(join(unpackingFolder, "index.html"))).to.equal(
            true
        );
        expect(
            await readFile(join(unpackingFolder, "index.html"), "utf8")
        ).to.equal("index.html");
    });

    it("creates a deployment", async () => {
        await deploy.handler({
            ...commonOptions,
            target: join(targetTree, "target")
        });
        expect(deploymentsCreateStub).to.have.callCount(1);
    });
});
