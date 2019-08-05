import { expect } from "chai";
import sinon from "sinon";

import {
    AppNotFoundError,
    BundleNotFoundError,
    ConfigurationNotValidError,
    ConflictingEntrypointError,
    EntrypointUrlMatcherNotValidError
} from "../../src/common/errors";
import { Operation } from "../../src/entities/OperationLog";
import CreateEntrypoint from "../../src/usecases/CreateEntrypoint";
import { getMockDependencies } from "../testUtils";

describe("usecase CreateEntrypoint", () => {
    it("throws EntrypointUrlMatcherNotValidError if the urlMatcher is not valid", async () => {
        const createEntrypoint = new CreateEntrypoint(getMockDependencies());
        const createEntrypointPromise = createEntrypoint.exec({
            appId: "appId",
            urlMatcher: "*"
        });
        await expect(createEntrypointPromise).to.be.rejectedWith(
            EntrypointUrlMatcherNotValidError
        );
        await expect(createEntrypointPromise).to.be.rejectedWith(
            "* is not a valid urlMatcher for an entrypoint"
        );
    });

    it("throws ConfigurationNotValidError if the configuration is not valid", async () => {
        const createEntrypoint = new CreateEntrypoint(getMockDependencies());
        const createEntrypointPromise = createEntrypoint.exec({
            appId: "appId",
            urlMatcher: "example.com/",
            configuration: "not-valid-configuration" as any
        });
        await expect(createEntrypointPromise).to.be.rejectedWith(
            ConfigurationNotValidError
        );
        await expect(createEntrypointPromise).to.be.rejectedWith(
            "configuration is not a valid configuration object"
        );
    });

    it("throws AppNotFoundError if the entrypoint links to a non-existing app", async () => {
        const deps = getMockDependencies();
        deps.storages.apps.findOne.resolves(null);
        const createEntrypoint = new CreateEntrypoint(deps);
        const createEntrypointPromise = createEntrypoint.exec({
            appId: "appId",
            urlMatcher: "example.com/"
        });
        await expect(createEntrypointPromise).to.be.rejectedWith(
            AppNotFoundError
        );
        await expect(createEntrypointPromise).to.be.rejectedWith(
            "No app found with id = appId"
        );
    });

    it("throws BundleNotFoundError if the entrypoint links to a non-existing bundle", async () => {
        const deps = getMockDependencies();
        deps.storages.apps.findOne.resolves({} as any);
        deps.storages.bundles.findOne.resolves(null);
        const createEntrypoint = new CreateEntrypoint(deps);
        const createEntrypointPromise = createEntrypoint.exec({
            appId: "appId",
            urlMatcher: "example.com/",
            bundleId: "bundleId"
        });
        await expect(createEntrypointPromise).to.be.rejectedWith(
            BundleNotFoundError
        );
        await expect(createEntrypointPromise).to.be.rejectedWith(
            "No bundle found with id = bundleId"
        );
    });

    it("throws ConflictingEntrypointError if an entrypoint with the same urlMatcher exists", async () => {
        const deps = getMockDependencies();
        deps.storages.apps.findOne.resolves({} as any);
        deps.storages.entrypoints.findOneByUrlMatcher.resolves({} as any);
        const createEntrypoint = new CreateEntrypoint(deps);
        const createEntrypointPromise = createEntrypoint.exec({
            appId: "appId",
            urlMatcher: "example.com/"
        });
        await expect(createEntrypointPromise).to.be.rejectedWith(
            ConflictingEntrypointError
        );
        await expect(createEntrypointPromise).to.be.rejectedWith(
            "An entrypoint with urlMatcher = example.com/ already exists"
        );
    });

    it("creates an entrypoint", async () => {
        const deps = getMockDependencies();
        deps.storages.apps.findOne.resolves({} as any);
        const createEntrypoint = new CreateEntrypoint(deps);
        await createEntrypoint.exec({
            appId: "appId",
            urlMatcher: "example.com/"
        });
        expect(deps.storages.entrypoints.createOne).to.have.been.calledOnceWith(
            {
                id: sinon.match.string,
                urlMatcher: "example.com/",
                appId: "appId",
                bundleId: null,
                redirectTo: null,
                configuration: null,
                createdAt: sinon.match.date,
                updatedAt: sinon.match.date
            }
        );
    });

    it("logs the create entrypoint operation", async () => {
        const deps = getMockDependencies();
        deps.storages.apps.findOne.resolves({} as any);
        const createEntrypoint = new CreateEntrypoint(deps);
        await createEntrypoint.exec({
            appId: "appId",
            urlMatcher: "example.com/"
        });
        expect(
            deps.storages.operationLogs.createOne
        ).to.have.been.calledOnceWith(
            sinon.match.has("operation", Operation.CreateEntrypoint)
        );
    });

    it("returns the created entrypoint", async () => {
        const deps = getMockDependencies();
        const mockCreatedEntrypoint = {} as any;
        deps.storages.apps.findOne.resolves({} as any);
        deps.storages.entrypoints.createOne.resolves(mockCreatedEntrypoint);
        const createEntrypoint = new CreateEntrypoint(deps);
        const createdEntrypoint = await createEntrypoint.exec({
            appId: "appId",
            urlMatcher: "example.com/"
        });
        expect(createdEntrypoint).to.equal(mockCreatedEntrypoint);
    });
});
