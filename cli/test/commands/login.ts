import chai = require("chai");
import fs = require("fs-extra");
import mockFs = require("mock-fs");
import os = require("os");
import sinon = require("sinon");
const { expect } = chai;

import * as login from "../../src/commands/login";

describe("login", () => {
    it("export the correct command", () => {
        expect(login.command).to.equal("login");
    });

    it("export the correct description", () => {
        expect(login.describe).to.equal(
            "Set the staticdeploy credentials in a .staticdeployrc file inside home directory"
        );
    });

    it("export the correct builder", () => {
        expect(login.builder).to.deep.equal({
            apiUrl: {
                default: "http://localhost:3000",
                describe: "Api server url",
                type: "string"
            },
            apiToken: {
                describe: "Api server auth token",
                type: "string",
                demandOption: true
            }
        });
    });

    it("export the correct handler", () => {
        expect(login.handler).to.be.a("function");
    });

    describe("handler function", () => {
        let osStub: sinon.SinonStub;
        before(() => {
            mockFs();
            osStub = sinon.stub(os, "homedir").returns("/home-directory");
        });

        beforeEach(() => {
            osStub.resetHistory();
        });

        afterEach(() => {
            mockFs.restore();
        });

        after(() => {
            osStub.restore();
        });

        it("calls fs.outputJsonSync function with correct parameters", () => {
            login.handler({
                _: ["login"],
                apiUrl: "api-url",
                apiToken: "api-token",
                $0: "build/bin/staticdeploy.js"
            });
            expect(fs.existsSync("/home-directory/.staticdeployrc")).to.equal(
                true
            );
            expect(
                fs.readJsonSync("/home-directory/.staticdeployrc")
            ).to.deep.equal({
                apiUrl: "api-url",
                apiToken: "api-token"
            });
        });
    });
});
