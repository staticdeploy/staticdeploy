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

        it("logs the start of the execution", async () => {
            const deps = getMockDependencies();

            const UsecaseImpl = getUsecaseImpl(async () => undefined);
            const usecaseImpl = new UsecaseImpl(deps);
            await usecaseImpl.exec();

            expect(deps.logger.log).to.have.been.calledWith(
                sinon.match.has("message", "usecase execution started")
            );
        });

        describe("logs the end of the execution", () => {
            it("case: success", async () => {
                const deps = getMockDependencies();

                const UsecaseImpl = getUsecaseImpl(async () => undefined);
                const usecaseImpl = new UsecaseImpl(deps);
                await usecaseImpl.exec();

                expect(deps.logger.log).to.have.been.calledWith(
                    sinon.match.has(
                        "message",
                        "usecase execution terminated successfully"
                    )
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

                expect(deps.logger.log).to.have.been.calledWith(
                    sinon.match.has(
                        "message",
                        "usecase execution terminated with error"
                    )
                );
            });
            it("case: unexpected failure", async () => {
                const deps = getMockDependencies();

                const UsecaseImpl = getUsecaseImpl(async () => {
                    throw new Error();
                });
                const usecaseImpl = new UsecaseImpl(deps);
                try {
                    await usecaseImpl.exec();
                } catch {
                    // Ignore the thrown error
                }

                expect(deps.logger.log).to.have.been.calledWith(
                    sinon.match.has(
                        "message",
                        "usecase execution failed unexpectedly"
                    )
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
