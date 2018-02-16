import chai = require("chai");
import sinon = require("sinon");
import yargs = require("yargs");
const { expect } = chai;

import * as deployments from "../../src/commands/deployments";

describe("deployments command", () => {
    it("export the correct command", () => {
        expect(deployments.command).to.equal("deployments <command>");
    });

    it("export the correct description", () => {
        expect(deployments.describe).to.equal("Manage deployments");
    });

    it("export the correct builder", () => {
        expect(deployments.builder).to.be.a("function");
    });

    describe("builder function", () => {
        let yargsStub: sinon.SinonStub;

        before(() => {
            yargsStub = sinon.stub(yargs, "commandDir");
        });

        beforeEach(() => {
            yargsStub.resetHistory();
        });

        after(() => {
            yargsStub.restore();
        });

        it("calls fs.outputJsonSync function with correct parameters", () => {
            deployments.builder(yargs);
            expect(yargsStub).to.have.callCount(1);
            expect(yargsStub).to.have.been.calledWithExactly("./deployments");
        });
    });
});
