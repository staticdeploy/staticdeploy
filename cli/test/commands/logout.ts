import chai = require("chai");
import findUp = require("find-up");
import fs = require("fs-extra");
import sinon = require("sinon");
const { expect } = chai;

import { IArgv } from "../../src/bin/staticdeploy";
import * as logout from "../../src/commands/logout";

describe("logout", () => {
    it("export the correct command", () => {
        expect(logout.command).to.equal("logout");
    });

    it("export the correct description", () => {
        expect(logout.describe).to.equal("Remove .staticdeployrc file");
    });

    it("export the correct builder", () => {
        expect(logout.builder).to.deep.equal({
            apiUrl: {
                describe: "Api server url",
                type: "string"
            },
            apiToken: {
                describe: "Api server auth token",
                type: "string"
            }
        });
    });

    it("export the correct handler", () => {
        expect(logout.handler).to.be.a("function");
    });

    describe("handler function", () => {
        let argv: IArgv;

        let fsStub: sinon.SinonStub;
        let findUpStub: sinon.SinonStub;
        before(() => {
            fsStub = sinon.stub(fs, "removeSync");
        });

        beforeEach(() => {
            fsStub.resetHistory();
            argv = {
                _: ["logout"],
                apiUrl: "api-url",
                apiToken: "api-token",
                $0: "build/bin/staticdeploy.js"
            };
        });

        afterEach(() => {
            findUpStub.restore();
        });

        after(() => {
            fsStub.restore();
        });

        it("calls findUp.sync with correct parameter", () => {
            findUpStub = sinon
                .stub(findUp, "sync")
                .returns("/home-directory/.staticdeployrc");
            logout.handler(argv);
            expect(findUp.sync).to.have.callCount(1);
            expect(findUp.sync).to.have.been.calledWithExactly([
                ".staticdeployrc"
            ]);
        });

        describe("if findUp.sync don't find .staticdeployrc file", () => {
            it("do not overwrite apiUrl and apiToken", () => {
                findUpStub = sinon.stub(findUp, "sync").returns(undefined);
                logout.handler(argv);
                expect(argv).to.deep.equal({
                    _: ["logout"],
                    apiUrl: "api-url",
                    apiToken: "api-token",
                    $0: "build/bin/staticdeploy.js"
                });
                expect(fs.removeSync).to.have.callCount(0);
            });

            it("do not call fs.removeSync", () => {
                findUpStub = sinon.stub(findUp, "sync").returns(undefined);
                logout.handler(argv);
                expect(fs.removeSync).to.have.callCount(0);
            });
        });

        describe("if findUp.sync find .staticdeployrc file", () => {
            it("set apiUrl and apiToken to undefined", () => {
                findUpStub = sinon
                    .stub(findUp, "sync")
                    .returns("/home-directory/.staticdeployrc");
                logout.handler(argv);
                expect(argv).to.deep.equal({
                    _: ["logout"],
                    apiUrl: undefined,
                    apiToken: undefined,
                    $0: "build/bin/staticdeploy.js"
                });
            });

            it("calls removeSync with correct path config", () => {
                findUpStub = sinon
                    .stub(findUp, "sync")
                    .returns("/home-directory/.staticdeployrc");
                logout.handler(argv);
                expect(fs.removeSync).to.have.callCount(1);
                expect(fs.removeSync).to.have.been.calledWithExactly(
                    "/home-directory/.staticdeployrc"
                );
            });
        });
    });
});
