import { expect } from "chai";
import sinon from "sinon";

import {
    AuthenticationRequiredError,
    EntrypointNotFoundError
} from "../../src/common/errors";
import { Operation } from "../../src/entities/OperationLog";
import DeleteEntrypoint from "../../src/usecases/DeleteEntrypoint";
import { getMockDependencies } from "../testUtils";

describe("usecase DeleteEntrypoint", () => {
    it("throws AuthenticationRequiredError if the request is not authenticated", async () => {
        const deps = getMockDependencies();
        deps.requestContext.userId = null;
        const deleteEntrypoint = new DeleteEntrypoint(deps);
        const deleteEntrypointPromise = deleteEntrypoint.exec("entrypointId");
        await expect(deleteEntrypointPromise).to.be.rejectedWith(
            AuthenticationRequiredError
        );
        await expect(deleteEntrypointPromise).to.be.rejectedWith(
            "This operation requires the request to be authenticated"
        );
    });

    it("throws EntrypointNotFoundError if no entrypoint with the specified id exists", async () => {
        const deleteEntrypoint = new DeleteEntrypoint(getMockDependencies());
        const deleteEntrypointPromise = deleteEntrypoint.exec("entrypointId");
        await expect(deleteEntrypointPromise).to.be.rejectedWith(
            EntrypointNotFoundError
        );
        await expect(deleteEntrypointPromise).to.be.rejectedWith(
            "No entrypoint found with id = entrypointId"
        );
    });

    it("deletes the entrypoint", async () => {
        const deps = getMockDependencies();
        deps.entrypointsStorage.findOne.resolves({} as any);
        const deleteEntrypoint = new DeleteEntrypoint(deps);
        await deleteEntrypoint.exec("entrypointId");
        expect(deps.entrypointsStorage.deleteOne).to.have.been.calledOnceWith(
            "entrypointId"
        );
    });

    it("logs the delete entrypoint operation", async () => {
        const deps = getMockDependencies();
        deps.entrypointsStorage.findOne.resolves({} as any);
        const deleteEntrypoint = new DeleteEntrypoint(deps);
        await deleteEntrypoint.exec("entrypointId");
        expect(deps.operationLogsStorage.createOne).to.have.been.calledOnceWith(
            sinon.match.has("operation", Operation.deleteEntrypoint)
        );
    });
});
