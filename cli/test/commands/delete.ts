// import StaticdeployClient from "@staticdeploy/sdk";
import BundlesClient from "@staticdeploy/sdk/lib/BundlesClient";
import AppsClient from "@staticdeploy/sdk/lib/AppsClient";
import EntrypointsClient from "@staticdeploy/sdk/lib/EntrypointsClient";
import { expect } from "chai";
import { createTree, destroyTree } from "create-fs-tree";
import { emptyDirSync } from "fs-extra";
import { tmpdir } from "os";
import { join } from "path";
import sinon from "sinon";
import yargs from "yargs";

import deleteCommand from "../../src/commands/delete";

describe("delete command", () => {
  const baseTestPath = join(tmpdir(), "staticdeploy-cli");
  before(() => {
    emptyDirSync(baseTestPath);
  });

  describe("config", () => {
    // Setup (and cleanup) test fs
    const workdir = join(baseTestPath, "delete-workdir");
    before(() => {
      createTree(workdir, {
        "staticdeploy.config.js": `module.exports = {
                    "delete": {
                        apiUrl: "staticdeploy.config.js apiUrl",
                        apiToken: "apiToken",
                        app: "from",
                        entrypoint: "name",
                        tag: "tag"
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
      .command({ ...deleteCommand, handler })
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
          `delete --config ${workdir}/staticdeploy.config.js`,
          ignoreParseErrors
        );
        expect(handler).to.have.callCount(1);
        expect(handler).to.have.been.calledWithMatch({
          apiUrl: "staticdeploy.config.js apiUrl",
        });
      });

      it("case: command line flags", () => {
        argv.parse(
          "delete --config non-existing --apiUrl apiUrl --apiToken apiToken --app app --entrypoint entrypoint --tag tag",
          ignoreParseErrors
        );
        expect(handler).to.have.callCount(1);
        expect(handler).to.have.been.calledWithMatch({
          apiUrl: "apiUrl",
        });
      });

      it("case: config file and command line flags", () => {
        argv.parse(
          `delete --config ${workdir}/staticdeploy.config.js --apiUrl apiUrl`
        );
        expect(handler).to.have.callCount(1);
        expect(handler).to.have.been.calledWithMatch({
          apiUrl: "apiUrl",
        });
      });
    });
  });

  describe("handler", () => {
    let bundlesClientDeleteByNameAndTag: sinon.SinonStub<
      Parameters<typeof BundlesClient.prototype.deleteByNameAndTag>,
      ReturnType<typeof BundlesClient.prototype.deleteByNameAndTag>
    >;

    let appsClientDelete: sinon.SinonStub<
      Parameters<typeof AppsClient.prototype.delete>,
      ReturnType<typeof AppsClient.prototype.delete>
    >;
    let entrypointsClientDelete: sinon.SinonStub<
      Parameters<typeof EntrypointsClient.prototype.delete>,
      ReturnType<typeof EntrypointsClient.prototype.delete>
    >;

    beforeEach(() => {
      bundlesClientDeleteByNameAndTag = sinon.stub(
        BundlesClient.prototype,
        "deleteByNameAndTag"
      );

      appsClientDelete = sinon.stub(AppsClient.prototype, "delete");
      entrypointsClientDelete = sinon.stub(
        EntrypointsClient.prototype,
        "delete"
      );
    });
    afterEach(() => {
      bundlesClientDeleteByNameAndTag.restore();
      appsClientDelete.restore();
      entrypointsClientDelete.restore();
    });

    it("delete app entrypoint and bundle", async () => {
      await deleteCommand.handler({
        apiUrl: "apiUrl",
        apiToken: "apiToken",
        app: "app",
        entrypoint: "entrypoint",
        tag: "tag",
      });

      expect(bundlesClientDeleteByNameAndTag).to.have.callCount(1);
      expect(appsClientDelete).to.have.callCount(1);
      expect(appsClientDelete).to.have.callCount(1);
      expect(entrypointsClientDelete).to.have.callCount(1);
    });
  });
});
