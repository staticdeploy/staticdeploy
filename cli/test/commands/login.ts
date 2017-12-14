import chai = require("chai");
import fs = require("fs-extra");
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
        let fsStub: sinon.SinonStub;
        let osStub: sinon.SinonStub;
        before(() => {
            fsStub = sinon.stub(fs, "outputJsonSync");
            osStub = sinon.stub(os, "homedir").returns("/home-directory");
        });

        beforeEach(() => {
            fsStub.resetHistory();
            osStub.resetHistory();
        });

        after(() => {
            fsStub.restore();
            osStub.restore();
        });

        it("calls fs.outputJsonSync function with correct parameters", () => {
            login.handler({
                _: ["login"],
                apiUrl: "api-url",
                apiToken: "api-token",
                $0: "build/bin/staticdeploy.js"
            });
            expect(fs.outputJsonSync).to.have.callCount(1);
            expect(fs.outputJsonSync).to.have.been.calledWithExactly(
                "/home-directory/.staticdeployrc",
                {
                    apiUrl: "api-url",
                    apiToken: "api-token"
                },
                { spaces: 4 }
            );
        });
    });
});
