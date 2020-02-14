import { expect } from "chai";
import sinon from "sinon";

import {
    AuthenticationRequiredError,
    FunctionalError
} from "../../src/common/functionalErrors";
import UnexpectedError from "../../src/common/UnexpectedError";
import Usecase from "../../src/common/Usecase";
import { getMockDependencies } from "../testUtils";

describe("common abstract class Usecase", () => {
    describe("exec", () => {
        const getUsecaseImpl = (_exec: () => Promise<void>) =>
            class UsecaseImpl extends Usecase<[], void> {
                protected _exec = _exec;
            };

        it("sets the usecase name in the log context", async () => {
            const deps = getMockDependencies();

            const UsecaseImpl = getUsecaseImpl(async () => undefined);
            const usecaseImpl = new UsecaseImpl(deps);
            await usecaseImpl.exec();

            expect(deps.logger.addToContext).to.have.been.calledWith(
                "usecase",
                "UsecaseImpl"
            );
        });

        it("sets the user id in the log context", async () => {
            const deps = getMockDependencies();

            const UsecaseImpl = getUsecaseImpl(async () => undefined);
            const usecaseImpl = new UsecaseImpl(deps);
            await usecaseImpl.exec();

            expect(deps.logger.addToContext).to.have.been.calledWith(
                "userId",
                "anonymous"
            );
        });

        it("logs the start of the execution", async () => {
            const deps = getMockDependencies();

            const UsecaseImpl = getUsecaseImpl(async () => undefined);
            const usecaseImpl = new UsecaseImpl(deps);
            await usecaseImpl.exec();

            expect(deps.logger.info).to.have.been.calledWith(
                "usecase execution started"
            );
        });

        describe("logs the end of the execution", () => {
            it("case: success", async () => {
                const deps = getMockDependencies();

                const UsecaseImpl = getUsecaseImpl(async () => undefined);
                const usecaseImpl = new UsecaseImpl(deps);
                await usecaseImpl.exec();

                expect(deps.logger.info).to.have.been.calledWith(
                    "usecase execution terminated successfully",
                    sinon.match({ execTimeMs: sinon.match.number })
                );
            });
            it("case: expected failure", async () => {
                const deps = getMockDependencies();

                const UsecaseImpl = getUsecaseImpl(async () => {
                    throw new AuthenticationRequiredError();
                });
                const usecaseImpl = new UsecaseImpl(deps);
                try {
                    await usecaseImpl.exec();
                } catch {
                    // Ignore the thrown error
                }

                expect(deps.logger.info).to.have.been.calledWith(
                    "usecase execution terminated with error",
                    sinon.match({
                        execTimeMs: sinon.match.number,
                        error: sinon.match.instanceOf(
                            AuthenticationRequiredError
                        )
                    })
                );
            });
            it("case: unexpected failure", async () => {
                const deps = getMockDependencies();

                const error = new Error("error message");
                const UsecaseImpl = getUsecaseImpl(async () => {
                    throw error;
                });
                const usecaseImpl = new UsecaseImpl(deps);
                try {
                    await usecaseImpl.exec();
                } catch {
                    // Ignore the thrown error
                }

                expect(deps.logger.error).to.have.been.calledWith(
                    "usecase execution failed unexpectedly",
                    sinon.match({
                        execTimeMs: sinon.match.number,
                        error: error
                    })
                );
            });
        });

        it("re-throws FunctionalError-s thrown during the execution", async () => {
            const UsecaseImpl = getUsecaseImpl(async () => {
                throw new AuthenticationRequiredError();
            });
            const usecaseImpl = new UsecaseImpl(getMockDependencies());
            const execPromise = usecaseImpl.exec();

            await expect(execPromise).to.be.rejectedWith(FunctionalError);
        });

        it("converts other execution errors to UnexpectedError-s", async () => {
            const UsecaseImpl = getUsecaseImpl(async () => {
                throw new Error();
            });
            const usecaseImpl = new UsecaseImpl(getMockDependencies());
            const execPromise = usecaseImpl.exec();

            await expect(execPromise).to.be.rejectedWith(UnexpectedError);
        });
    });
});
