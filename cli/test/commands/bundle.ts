import BundlesClient from "@staticdeploy/sdk/lib/BundlesClient";
import tarArchiver from "@staticdeploy/tar-archiver";
import { expect } from "chai";
import { createTree, destroyTree } from "create-fs-tree";
import { emptyDirSync, removeSync } from "fs-extra";
import { tmpdir } from "os";
import { join } from "path";
import sinon from "sinon";
import yargs from "yargs";

import bundle from "../../src/commands/bundle";

describe("bundle command", () => {
    const baseTestPath = join(tmpdir(), "staticdeploy-cli");
    before(() => {
        emptyDirSync(baseTestPath);
    });

    describe("config", () => {
        // Setup (and cleanup) test fs
        const workdir = join(baseTestPath, "bundle-workdir");
        before(() => {
            createTree(workdir, {
                "staticdeploy.config.js": `module.exports = {
                    "bundle": {
                        apiUrl: "staticdeploy.config.js apiUrl",
                        apiToken: "apiToken",
                        from: "from",
                        name: "name",
                        tag: "tag",
                        description: "description",
                        fallbackAssetPath: "/fallbackAssetPath",
                        fallbackStatusCode: 200,
                        headers: {
                            "assetMatcher": {
                                "headerName": "headerValue"
                            }
                        }
                    }
                };`,
                "custom.config.js": `module.exports = {
                    "bundle": {
                        apiUrl: "custom.config.js apiUrl",
                        apiToken: "apiToken",
                        from: "from",
                        name: "name",
                        tag: "tag",
                        description: "description",
                        fallbackAssetPath: "/fallbackAssetPath",
                        fallbackStatusCode: 200,
                        headers: {
                            "assetMatcher": {
                                "headerName": "headerValue"
                            }
                        }
                    }
                };`
            });
        });
        after(() => {
            destroyTree(workdir);
        });

        // Use the bundle command definition in a test instance of yargs,
        // configured as the real instance in src/bin/staticdeploy.js
        const handler = sinon.spy();
        const argv = yargs
            .command({ ...bundle, handler })
            .demandCommand(1)
            .exitProcess(false)
            .strict();
        beforeEach(() => {
            handler.resetHistory();
        });

        // Stub process.cwd() so that it returns the workdir specified above, so
        // that path.resolve resolves paths relative to that
        before(() => {
            sinon.stub(process, "cwd").returns(workdir);
        });
        after(() => {
            (process.cwd as sinon.SinonStub).restore();
        });

        // No-op function to ignore parse errors
        const ignoreParseErrors = () => null;

        describe("reads options from a config file or from command line flags", () => {
            it("case: default config file", () => {
                argv.parse("bundle", ignoreParseErrors);
                expect(handler).to.have.callCount(1);
                expect(handler).to.have.been.calledWithMatch({
                    apiUrl: "staticdeploy.config.js apiUrl"
                });
            });

            it("case: non-default config file", () => {
                argv.parse(
                    "bundle --config custom.config.js",
                    ignoreParseErrors
                );
                expect(handler).to.have.callCount(1);
                expect(handler).to.have.been.calledWithMatch({
                    apiUrl: "custom.config.js apiUrl"
                });
            });

            it("case: command line flags", () => {
                argv.parse(
                    "bundle --config non-existing --apiUrl apiUrl --apiToken apiToken --from from --name name --tag tag --description description",
                    ignoreParseErrors
                );
                expect(handler).to.have.callCount(1);
                expect(handler).to.have.been.calledWithMatch({
                    apiUrl: "apiUrl"
                });
            });

            it("case: config file and command line flags", () => {
                argv.parse("bundle --apiUrl apiUrl");
                expect(handler).to.have.callCount(1);
                expect(handler).to.have.been.calledWithMatch({
                    apiUrl: "apiUrl"
                });
            });
        });
    });

    describe("handler", () => {
        // Setup test fs, and clean it up afterward
        const unpackingFolder = join(baseTestPath, "unpacking-folder");
        const targetTree = join(baseTestPath, "target-tree");
        beforeEach(() => {
            createTree(targetTree, {
                target: {
                    "index.html": "index.html",
                    js: {
                        "index.js": "index.js"
                    }
                },
                "not-a-directory": "not-a-directory"
            });
            emptyDirSync(unpackingFolder);
        });
        after(() => {
            removeSync(unpackingFolder);
            destroyTree(targetTree);
        });

        // Common options to pass the handler
        const commonOptions = {
            apiUrl: "apiUrl",
            apiToken: "apiToken",
            name: "name",
            tag: "tag",
            description: "description",
            fallbackAssetPath: "/index.html",
            fallbackStatusCode: 200,
            headers: "{}"
        };

        // Stub BundlesClient.create to:
        // - prevent it from actually creating a bundle (which would fail, given
        //   the options above)
        // - run assertions on it being called, verifying the correct behavior
        //   of the handler
        let bundlesCreateStub: sinon.SinonStub<
            Parameters<typeof BundlesClient.prototype.create>,
            ReturnType<typeof BundlesClient.prototype.create>
        >;
        beforeEach(() => {
            bundlesCreateStub = sinon.stub(BundlesClient.prototype, "create");
        });
        afterEach(() => {
            bundlesCreateStub.restore();
        });

        it("throws an error if the target path is empty", async () => {
            const createPromise = bundle.handler({
                ...commonOptions,
                from: join(targetTree, "path-to-nothing")
            });
            await expect(createPromise).to.be.rejectedWith(
                /No directory found at/
            );
        });

        it("throws error if the target path is not a directory", async () => {
            const createPromise = bundle.handler({
                ...commonOptions,
                from: join(targetTree, "not-a-directory")
            });
            await expect(createPromise).to.be.rejectedWith(
                /No directory found at/
            );
        });

        it("throws error if there is no file corresponding to the specified fallbackAssetPath", async () => {
            const createPromise = bundle.handler({
                ...commonOptions,
                from: join(targetTree, "target"),
                fallbackAssetPath: "/non-existing"
            });
            await expect(createPromise).to.be.rejectedWith(
                /\/non-existing cannot be set as fallbackAssetPath/
            );
        });

        it("packages the target path into a tar archive", async () => {
            await bundle.handler({
                ...commonOptions,
                from: join(targetTree, "target")
            });
            const { content } = bundlesCreateStub.getCall(0).args[0];
            const files = await tarArchiver.extractFiles(
                Buffer.from(content, "base64")
            );
            expect(files).to.deep.equalInAnyOrder([
                { path: "/index.html", content: Buffer.from("index.html") },
                { path: "/js/index.js", content: Buffer.from("index.js") }
            ]);
        });

        it("creates a bundle", async () => {
            await bundle.handler({
                ...commonOptions,
                from: join(targetTree, "target")
            });
            expect(bundlesCreateStub).to.have.callCount(1);
            expect(bundlesCreateStub).to.have.been.calledWithMatch({
                content: sinon.match.string,
                name: "name",
                tag: "tag",
                description: "description",
                fallbackAssetPath: "/index.html",
                fallbackStatusCode: 200,
                headers: {}
            });
        });
    });
});
