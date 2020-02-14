import { expect } from "chai";
import sinon from "sinon";

import SimpleJsonLogger from "../src";

const getMockOutStream = () => ({ write: sinon.stub() });

describe("SimpleJsonLogger", () => {
    describe("log", () => {
        it("when an out stream is provided, writes a JSON log to it", () => {
            const outStream = getMockOutStream();
            const logger = new SimpleJsonLogger(outStream as any);
            logger.info("message");
            expect(outStream.write).to.have.been.calledWith(sinon.match.string);
            JSON.parse(outStream.write.getCall(0).args[0]);
        });

        it("when no out stream is provided, does nothing", () => {
            const logger = new SimpleJsonLogger(null);
            logger.info("message");
        });

        it("writes logs with context", () => {
            const outStream = getMockOutStream();
            const logger = new SimpleJsonLogger(outStream as any);
            logger.info("message");
            const log = JSON.parse(outStream.write.getCall(0).args[0]);
            expect(log).to.have.property("context");
        });

        it("writes logs without details", () => {
            const outStream = getMockOutStream();
            const logger = new SimpleJsonLogger(outStream as any);
            logger.info("message");
            const log = JSON.parse(outStream.write.getCall(0).args[0]);
            expect(log).not.to.have.property("details");
        });

        it("writes logs with details", () => {
            const outStream = getMockOutStream();
            const logger = new SimpleJsonLogger(outStream as any);
            logger.info("message", {});
            const log = JSON.parse(outStream.write.getCall(0).args[0]);
            expect(log).to.have.property("details");
        });

        it("when details.error is logged, converts it to error details", () => {
            const outStream = getMockOutStream();
            const logger = new SimpleJsonLogger(outStream as any);
            const error = new Error("message");
            logger.info("message", { error });
            const log = JSON.parse(outStream.write.getCall(0).args[0]);
            expect(log).to.have.deep.nested.property("details.error", {
                name: "Error",
                message: "message",
                stack: error.stack
            });
        });
    });

    describe("addToContext", () => {
        it("adds info to the context property of logs", () => {
            const outStream = getMockOutStream();
            const logger = new SimpleJsonLogger(outStream as any);
            logger.addToContext("key", "value");
            logger.info("message");
            const log = JSON.parse(outStream.write.getCall(0).args[0]);
            expect(log).to.have.deep.property("context", { key: "value" });
        });
    });
});
