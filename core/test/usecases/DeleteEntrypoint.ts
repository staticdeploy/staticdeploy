import { expect } from "chai";
import sinon from "sinon";

import { EntrypointNotFoundError } from "../../src/common/functionalErrors";
import { Operation } from "../../src/entities/OperationLog";
import DeleteEntrypoint from "../../src/usecases/DeleteEntrypoint";
import { getMockDependencies } from "../testUtils";

describe("usecase DeleteEntrypoint", () => {
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
        deps.storages.entrypoints.findOne.resolves({} as any);
        const deleteEntrypoint = new DeleteEntrypoint(deps);
        await deleteEntrypoint.exec("entrypointId");
        expect(deps.storages.entrypoints.deleteOne).to.have.been.calledOnceWith(
            "entrypointId"
        );
    });

    it("logs the delete entrypoint operation", async () => {
        const deps = getMockDependencies();
        deps.storages.entrypoints.findOne.resolves({} as any);
        const deleteEntrypoint = new DeleteEntrypoint(deps);
        await deleteEntrypoint.exec("entrypointId");
        expect(
            deps.storages.operationLogs.createOne
        ).to.have.been.calledOnceWith(
            sinon.match.has("operation", Operation.DeleteEntrypoint)
        );
    });
});
