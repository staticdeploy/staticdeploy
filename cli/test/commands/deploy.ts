import StaticdeployClient from "@staticdeploy/sdk";
import { expect } from "chai";
import { createTree, destroyTree } from "create-fs-tree";
import { emptyDirSync } from "fs-extra";
import { tmpdir } from "os";
import { join } from "path";
import sinon from "sinon";
import yargs from "yargs";

import deploy from "../../src/commands/deploy";

describe("deploy command", () => {
    const baseTestPath = join(tmpdir(), "staticdeploy-cli");
    before(() => {
        emptyDirSync(baseTestPath);
    });

    describe("config", () => {
        // Setup (and cleanup) test fs
        const workdir = join(baseTestPath, "deploy-workdir");
        before(() => {
            createTree(workdir, {
                "staticdeploy.config.js": `module.exports = {
                    "deploy": {
                        apiUrl: "staticdeploy.config.js apiUrl",
                        apiToken: "apiToken",
                        app: "app",
                        entrypoint: "entrypoint",
                        bundle: "bundle"
                    }
                };`,
            });
        });
        after(() => {
            destroyTree(workdir);
        });

        // Use the bundle command definition in a test instance of yargs,
        // configured as the real instance in src/bin/staticdeploy.js
        const handler = sinon.spy();
        const argv = yargs
            .command({ ...deploy, handler })
            .demandCommand(1)
            .exitProcess(false)
            .strict();
        beforeEach(() => {
            handler.resetHistory();
        });

        // No-op function to ignore parse errors
        const ignoreParseErrors = () => null;

        describe("reads options from a config file or from command line flags", () => {
            it("case: config file", () => {
                argv.parse(
                    `deploy --config ${workdir}/staticdeploy.config.js`,
                    ignoreParseErrors
                );
                expect(handler).to.have.callCount(1);
                expect(handler).to.have.been.calledWithMatch({
                    apiUrl: "staticdeploy.config.js apiUrl",
                });
            });

            it("case: command line flags", () => {
                argv.parse(
                    "deploy --config non-existing --apiUrl apiUrl --apiToken apiToken --app app --entrypoint entrypoint --bundle bundle",
                    ignoreParseErrors
                );
                expect(handler).to.have.callCount(1);
                expect(handler).to.have.been.calledWithMatch({
                    apiUrl: "apiUrl",
                });
            });

            it("case: config file and command line flags", () => {
                argv.parse(
                    `deploy --config ${workdir}/staticdeploy.config.js --apiUrl apiUrl`
                );
                expect(handler).to.have.callCount(1);
                expect(handler).to.have.been.calledWithMatch({
                    apiUrl: "apiUrl",
                });
            });
        });
    });

    describe("handler", () => {
        // Stub StaticdeployClient.deploy to:
        // - prevent it from actually doing a deploy (which would fail, given
        //   the options with which the handler is called)
        // - run assertions on it being called, verifying the correct behavior
        //   of the handler
        let staticdeployDeployStub: sinon.SinonStub<
            Parameters<typeof StaticdeployClient.prototype.deploy>,
            ReturnType<typeof StaticdeployClient.prototype.deploy>
        >;
        beforeEach(() => {
            staticdeployDeployStub = sinon.stub(
                StaticdeployClient.prototype,
                "deploy"
            );
        });
        afterEach(() => {
            staticdeployDeployStub.restore();
        });

        it("deploys a bundle", async () => {
            await deploy.handler({
                apiUrl: "apiUrl",
                apiToken: "apiToken",
                app: "app",
                entrypoint: "entrypoint",
                bundle: "bundle",
            });
            expect(staticdeployDeployStub).to.have.callCount(1);
            expect(staticdeployDeployStub).to.have.been.calledWith({
                appName: "app",
                entrypointUrlMatcher: "entrypoint",
                bundleNameTagCombination: "bundle",
            });
        });
    });
});
