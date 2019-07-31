import { expect } from "chai";
import sinon from "sinon";

import {
    BundleNotFoundError,
    ConfigurationNotValidError,
    EntrypointNotFoundError
} from "../../src/common/errors";
import { Operation } from "../../src/entities/OperationLog";
import UpdateEntrypoint from "../../src/usecases/UpdateEntrypoint";
import { getMockDependencies } from "../testUtils";

describe("usecase UpdateEntrypoint", () => {
    it("throws EntrypointNotFoundError if no entrypoint with the specified id exists", async () => {
        const updateEntrypoint = new UpdateEntrypoint(getMockDependencies());
        const updateEntrypointPromise = updateEntrypoint.exec(
            "entrypointId",
            {}
        );
        await expect(updateEntrypointPromise).to.be.rejectedWith(
            EntrypointNotFoundError
        );
        await expect(updateEntrypointPromise).to.be.rejectedWith(
            "No entrypoint found with id = entrypointId"
        );
    });

    it("throws ConfigurationNotValidError if the configuration is not valid", async () => {
        const deps = getMockDependencies();
        deps.storages.entrypoints.findOne.resolves({} as any);
        const updateEntrypoint = new UpdateEntrypoint(deps);
        const updateEntrypointPromise = updateEntrypoint.exec("entrypointId", {
            configuration: "not-valid-configuration" as any
        });
        await expect(updateEntrypointPromise).to.be.rejectedWith(
            ConfigurationNotValidError
        );
        await expect(updateEntrypointPromise).to.be.rejectedWith(
            "configuration is not a valid configuration object"
        );
    });

    it("throws BundleNotFoundError if no bundle with the specified id exists", async () => {
        const deps = getMockDependencies();
        deps.storages.entrypoints.findOne.resolves({} as any);
        const updateEntrypoint = new UpdateEntrypoint(deps);
        const updateEntrypointPromise = updateEntrypoint.exec("entrypointId", {
            bundleId: "bundleId"
        });
        await expect(updateEntrypointPromise).to.be.rejectedWith(
            BundleNotFoundError
        );
        await expect(updateEntrypointPromise).to.be.rejectedWith(
            "No bundle found with id = bundleId"
        );
    });

    it("updates the entrypoint", async () => {
        const deps = getMockDependencies();
        deps.storages.entrypoints.findOne.resolves({} as any);
        deps.storages.bundles.findOne.resolves({} as any);
        const updateEntrypoint = new UpdateEntrypoint(deps);
        await updateEntrypoint.exec("entrypointId", {
            bundleId: "bundleId"
        });
        expect(deps.storages.entrypoints.updateOne).to.have.been.calledOnceWith(
            "entrypointId",
            {
                bundleId: "bundleId",
                redirectTo: undefined,
                configuration: undefined,
                updatedAt: sinon.match.date
            }
        );
    });

    it("logs the update entrypoint operation", async () => {
        const deps = getMockDependencies();
        deps.storages.entrypoints.findOne.resolves({} as any);
        const updateEntrypoint = new UpdateEntrypoint(deps);
        await updateEntrypoint.exec("entrypointId", {});
        expect(
            deps.storages.operationLogs.createOne
        ).to.have.been.calledOnceWith(
            sinon.match.has("operation", Operation.updateEntrypoint)
        );
    });

    it("returns the updated entrypoint", async () => {
        const deps = getMockDependencies();
        const mockUpdatedEntrypoint = {} as any;
        deps.storages.entrypoints.findOne.resolves({} as any);
        deps.storages.entrypoints.updateOne.resolves(mockUpdatedEntrypoint);
        const updateEntrypoint = new UpdateEntrypoint(deps);
        const updatedEntrypoint = await updateEntrypoint.exec(
            "entrypointId",
            {}
        );
        expect(updatedEntrypoint).to.equal(mockUpdatedEntrypoint);
    });
});
