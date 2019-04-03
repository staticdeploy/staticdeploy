import { expect } from "chai";
import sinon from "sinon";

import {
    AppNotFoundError,
    AuthenticationRequiredError,
    BundleNotFoundError,
    ConfigurationNotValidError,
    ConflictingEntrypointError,
    EntrypointNotFoundError,
    EntrypointUrlMatcherNotValidError
} from "../../src/common/errors";
import { Operation } from "../../src/entities/OperationLog";
import UpdateEntrypoint from "../../src/usecases/UpdateEntrypoint";
import { getMockDependencies } from "../testUtils";

describe("usecase UpdateEntrypoint", () => {
    it("throws AuthenticationRequiredError if the request is not authenticated", async () => {
        const deps = getMockDependencies();
        deps.requestContext.userId = null;
        const updateEntrypoint = new UpdateEntrypoint(deps);
        const updateEntrypointPromise = updateEntrypoint.exec(
            "entrypointId",
            {}
        );
        await expect(updateEntrypointPromise).to.be.rejectedWith(
            AuthenticationRequiredError
        );
        await expect(updateEntrypointPromise).to.be.rejectedWith(
            "This operation requires the request to be authenticated"
        );
    });

    it("throws EntrypointUrlMatcherNotValidError if the urlMatcher is not valid", async () => {
        const updateEntrypoint = new UpdateEntrypoint(getMockDependencies());
        const updateEntrypointPromise = updateEntrypoint.exec("entrypointId", {
            urlMatcher: "*"
        });
        await expect(updateEntrypointPromise).to.be.rejectedWith(
            EntrypointUrlMatcherNotValidError
        );
        await expect(updateEntrypointPromise).to.be.rejectedWith(
            "* is not a valid urlMatcher for an entrypoint"
        );
    });

    it("throws ConfigurationNotValidError if the configuration is not valid", async () => {
        const updateEntrypoint = new UpdateEntrypoint(getMockDependencies());
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

    it("throws AppNotFoundError if no app with the specified id exists", async () => {
        const deps = getMockDependencies();
        deps.storages.entrypoints.findOne.resolves({} as any);
        const updateEntrypoint = new UpdateEntrypoint(deps);
        const updateEntrypointPromise = updateEntrypoint.exec("entrypointId", {
            appId: "appId"
        });
        await expect(updateEntrypointPromise).to.be.rejectedWith(
            AppNotFoundError
        );
        await expect(updateEntrypointPromise).to.be.rejectedWith(
            "No app found with id = appId"
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

    it("throws ConflictingEntrypointError if an entrypoint with the same (to be updated) urlMatcher exists", async () => {
        const deps = getMockDependencies();
        deps.storages.entrypoints.findOne.resolves({} as any);
        deps.storages.entrypoints.findOneByUrlMatcher.resolves({} as any);
        const updateEntrypoint = new UpdateEntrypoint(deps);
        const updateEntrypointPromise = updateEntrypoint.exec("entrypointId", {
            urlMatcher: "example.com/"
        });
        await expect(updateEntrypointPromise).to.be.rejectedWith(
            ConflictingEntrypointError
        );
        await expect(updateEntrypointPromise).to.be.rejectedWith(
            "An entrypoint with urlMatcher = example.com/ already exists"
        );
    });

    it("updates the entrypoint", async () => {
        const deps = getMockDependencies();
        deps.storages.entrypoints.findOne.resolves({} as any);
        const updateEntrypoint = new UpdateEntrypoint(deps);
        await updateEntrypoint.exec("entrypointId", {
            urlMatcher: "example.com/"
        });
        expect(deps.storages.entrypoints.updateOne).to.have.been.calledOnceWith(
            "entrypointId",
            {
                urlMatcher: "example.com/",
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
