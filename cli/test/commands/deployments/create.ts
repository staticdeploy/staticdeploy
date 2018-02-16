import DeploymentsClient from "@staticdeploy/sdk/lib/DeploymentsClient";
import chai = require("chai");
import mockFs = require("mock-fs");
import sinon = require("sinon");
const { expect } = chai;

import * as deploymentsCreate from "../../../src/commands/deployments/create";

describe("deployments create command", () => {
    it("export the correct command", () => {
        expect(deploymentsCreate.command).to.equal("create");
    });

    it("export the correct description", () => {
        expect(deploymentsCreate.describe).to.equal("Create deployment");
    });

    it("export the correct builder", () => {
        expect(deploymentsCreate.builder).to.deep.equal({
            apiUrl: {
                default: "http://localhost:3000",
                describe: "Api server url",
                type: "string"
            },
            apiToken: {
                describe: "Api server auth token",
                type: "string",
                demandOption: true
            },
            appIdOrName: {
                describe: "Id or name of the app to deploy the deployment",
                type: "string"
            },
            contentPath: {
                describe: "Path of the content to upload",
                type: "string",
                demandOption: true
            },
            description: {
                describe: "Description to the content to deploy",
                type: "string"
            },
            entrypointIdOrUrlMatcher: {
                describe:
                    "Id or url of the entrypoint where you want to deploy",
                type: "string",
                demandOption: true
            }
        });
    });

    describe("handler function", () => {
        const content: string = "file content here";
        const appIdOrName: string = "app id or app name";
        const entrypointIdOrUrlMatcher: string = "entrypoint id or url";
        const description: string = "a description";

        let deploymentsCreateSdkStub: sinon.SinonStub;
        before(() => {
            deploymentsCreateSdkStub = sinon.stub(
                DeploymentsClient.prototype,
                "create"
            );
        });

        beforeEach(() => {
            mockFs({
                "path/to/fake/dir": {
                    "package.zip": content,
                    "empty-dir": {
                        /** empty directory */
                    }
                },
                "some/empty/path": {
                    /** another empty directory */
                }
            });
            deploymentsCreateSdkStub.resetHistory();
        });

        afterEach(() => {
            mockFs.restore();
        });

        after(() => {
            deploymentsCreateSdkStub.restore();
        });

        it("throw error if content path is empty", async () => {
            try {
                await deploymentsCreate.handler({
                    _: ["login"],
                    apiUrl: "api-url",
                    apiToken: "api-token",
                    contentPath: "path/to/fake/dir/package.zip",
                    appIdOrName,
                    entrypointIdOrUrlMatcher,
                    description,
                    $0: "build/bin/staticdeploy.js"
                });
            } catch (e) {
                expect(e).to.be.an("Error");
                expect(e.message).to.equal(
                    "There is nothing at the specified path"
                );
            }
        });

        it("throw error if it is a folder at the contentPath", async () => {
            try {
                await deploymentsCreate.handler({
                    _: ["login"],
                    apiUrl: "api-url",
                    apiToken: "api-token",
                    contentPath: "path/to/fake/dir/package.zip",
                    appIdOrName,
                    entrypointIdOrUrlMatcher,
                    description,
                    $0: "build/bin/staticdeploy.js"
                });
            } catch (e) {
                expect(e).to.be.an("Error");
                expect(e.message).to.equal(
                    "There is a folder at the specified path, please insert a path to a file"
                );
            }
        });

        it("if content exist, create deployments", async () => {
            await deploymentsCreate.handler({
                _: ["login"],
                apiUrl: "api-url",
                apiToken: "api-token",
                contentPath: "path/to/fake/dir/package.zip",
                appIdOrName,
                entrypointIdOrUrlMatcher,
                description,
                $0: "build/bin/staticdeploy.js"
            });
            expect(deploymentsCreateSdkStub).to.have.callCount(1);
            expect(deploymentsCreateSdkStub).to.have.been.calledWithExactly({
                content: Buffer.from(content).toString("base64"),
                appIdOrName,
                entrypointIdOrUrlMatcher,
                description
            });
        });
    });
});
