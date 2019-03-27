import { expect } from "chai";
import sinon from "sinon";

import {
    AppNameNotValidError,
    AuthenticationRequiredError,
    BundleNameTagCombinationNotValidError,
    BundleNotFoundError,
    EntrypointMismatchedAppIdError,
    EntrypointUrlMatcherNotValidError
} from "../../src/common/errors";
import { Operation } from "../../src/entities/OperationLog";
import DeployBundle from "../../src/usecases/DeployBundle";
import { getMockDependencies } from "../testUtils";

describe("usecase DeployBundle", () => {
    it("throws AuthenticationRequiredError if the request is not authenticated", async () => {
        const deps = getMockDependencies();
        deps.requestContext.userId = null;
        const deployBundle = new DeployBundle(deps);
        const deployBundlePromise = deployBundle.exec({
            bundleNameTagCombination: "name:tag",
            appName: "appName",
            entrypointUrlMatcher: "example.com/"
        });
        await expect(deployBundlePromise).to.be.rejectedWith(
            AuthenticationRequiredError
        );
        await expect(deployBundlePromise).to.be.rejectedWith(
            "This operation requires the request to be authenticated"
        );
    });

    it("throws BundleNameTagCombinationNotValidError if the name:tag combination is not valid", async () => {
        const deployBundle = new DeployBundle(getMockDependencies());
        const deployBundlePromise = deployBundle.exec({
            bundleNameTagCombination: "*",
            appName: "appName",
            entrypointUrlMatcher: "example.com/"
        });
        await expect(deployBundlePromise).to.be.rejectedWith(
            BundleNameTagCombinationNotValidError
        );
        await expect(deployBundlePromise).to.be.rejectedWith(
            "* is not a valid name:tag combination for a bundle"
        );
    });

    it("throws BundleNotFoundError if no bundle with the specified name:tag combination exists", async () => {
        const deployBundle = new DeployBundle(getMockDependencies());
        const deployBundlePromise = deployBundle.exec({
            bundleNameTagCombination: "name:tag",
            appName: "appName",
            entrypointUrlMatcher: "example.com/"
        });
        await expect(deployBundlePromise).to.be.rejectedWith(
            BundleNotFoundError
        );
        await expect(deployBundlePromise).to.be.rejectedWith(
            "No bundle found with name:tag combination = name:tag"
        );
    });

    it("throws EntrypointMismatchedAppIdError if the specified entrypoint exists, but the specified app doesn't", async () => {
        const deps = getMockDependencies();
        deps.bundlesStorage.findLatestByNameAndTag.resolves({} as any);
        deps.entrypointsStorage.findOneByUrlMatcher.resolves({} as any);
        const deployBundle = new DeployBundle(deps);
        const deployBundlePromise = deployBundle.exec({
            bundleNameTagCombination: "name:tag",
            appName: "appName",
            entrypointUrlMatcher: "example.com/"
        });
        await expect(deployBundlePromise).to.be.rejectedWith(
            EntrypointMismatchedAppIdError
        );
        await expect(deployBundlePromise).to.be.rejectedWith(
            "Entrypoint with urlMatcher = example.com/ doesn't link to app with name = appName"
        );
    });

    it("throws EntrypointMismatchedAppIdError if the specified entrypoint exists, but doesn't link to the specified app", async () => {
        const deps = getMockDependencies();
        deps.appsStorage.findOneByName.resolves({ id: "appId" } as any);
        deps.bundlesStorage.findLatestByNameAndTag.resolves({} as any);
        deps.entrypointsStorage.findOneByUrlMatcher.resolves({
            appId: "anotherAppId"
        } as any);
        const deployBundle = new DeployBundle(deps);
        const deployBundlePromise = deployBundle.exec({
            bundleNameTagCombination: "name:tag",
            appName: "appName",
            entrypointUrlMatcher: "example.com/"
        });
        await expect(deployBundlePromise).to.be.rejectedWith(
            EntrypointMismatchedAppIdError
        );
        await expect(deployBundlePromise).to.be.rejectedWith(
            "Entrypoint with urlMatcher = example.com/ doesn't link to app with name = appName"
        );
    });

    it("throws AppNameNotValidError if an app needs to be created, but the specified name is not valid", async () => {
        const deps = getMockDependencies();
        deps.bundlesStorage.findLatestByNameAndTag.resolves({} as any);
        const deployBundle = new DeployBundle(deps);
        const deployBundlePromise = deployBundle.exec({
            bundleNameTagCombination: "name:tag",
            appName: "*",
            entrypointUrlMatcher: "example.com/"
        });
        await expect(deployBundlePromise).to.be.rejectedWith(
            AppNameNotValidError
        );
        await expect(deployBundlePromise).to.be.rejectedWith(
            "* is not a valid name for an app"
        );
    });

    it("throws EntrypointUrlMatcherNotValidError if an entrypoint needs to be created, but the specified urlMatcher is not valid", async () => {
        const deps = getMockDependencies();
        deps.appsStorage.findOneByName.resolves({} as any);
        deps.bundlesStorage.findLatestByNameAndTag.resolves({} as any);
        const deployBundle = new DeployBundle(deps);
        const deployBundlePromise = deployBundle.exec({
            bundleNameTagCombination: "name:tag",
            appName: "appName",
            entrypointUrlMatcher: "*"
        });
        await expect(deployBundlePromise).to.be.rejectedWith(
            EntrypointUrlMatcherNotValidError
        );
        await expect(deployBundlePromise).to.be.rejectedWith(
            "* is not a valid urlMatcher for an entrypoint"
        );
    });

    it("creates the app and the entrypoint if they don't exist", async () => {
        const deps = getMockDependencies();
        deps.appsStorage.createOne.resolves({ id: "appId" } as any);
        deps.bundlesStorage.findLatestByNameAndTag.resolves({
            id: "bundleId"
        } as any);
        const deployBundle = new DeployBundle(deps);
        await deployBundle.exec({
            bundleNameTagCombination: "name:tag",
            appName: "appName",
            entrypointUrlMatcher: "example.com/"
        });
        expect(deps.appsStorage.createOne).to.have.been.calledOnceWith({
            id: sinon.match.string,
            name: "appName",
            defaultConfiguration: {},
            createdAt: sinon.match.date,
            updatedAt: sinon.match.date
        });
        expect(deps.entrypointsStorage.createOne).to.have.been.calledOnceWith({
            id: sinon.match.string,
            urlMatcher: "example.com/",
            appId: "appId",
            bundleId: "bundleId",
            configuration: null,
            redirectTo: null,
            createdAt: sinon.match.date,
            updatedAt: sinon.match.date
        });
    });

    it("creates the entrypoint if it doesn't exist", async () => {
        const deps = getMockDependencies();
        deps.appsStorage.findOneByName.resolves({ id: "appId" } as any);
        deps.bundlesStorage.findLatestByNameAndTag.resolves({
            id: "bundleId"
        } as any);
        const deployBundle = new DeployBundle(deps);
        await deployBundle.exec({
            bundleNameTagCombination: "name:tag",
            appName: "appName",
            entrypointUrlMatcher: "example.com/"
        });
        expect(deps.entrypointsStorage.createOne).to.have.been.calledOnceWith({
            id: sinon.match.string,
            urlMatcher: "example.com/",
            appId: "appId",
            bundleId: "bundleId",
            configuration: null,
            redirectTo: null,
            createdAt: sinon.match.date,
            updatedAt: sinon.match.date
        });
    });

    it("updates the entrypoint if it exist", async () => {
        const deps = getMockDependencies();
        deps.appsStorage.findOneByName.resolves({ id: "appId" } as any);
        deps.entrypointsStorage.findOneByUrlMatcher.resolves({
            id: "entrypointId",
            appId: "appId"
        } as any);
        deps.bundlesStorage.findLatestByNameAndTag.resolves({
            id: "bundleId"
        } as any);
        const deployBundle = new DeployBundle(deps);
        await deployBundle.exec({
            bundleNameTagCombination: "name:tag",
            appName: "appName",
            entrypointUrlMatcher: "example.com/"
        });
        expect(deps.entrypointsStorage.updateOne).to.have.been.calledOnceWith(
            "entrypointId",
            {
                bundleId: "bundleId",
                updatedAt: sinon.match.date
            }
        );
    });

    describe("logs the performed operations", () => {
        it("case: app and entrypoint created", async () => {
            const deps = getMockDependencies();
            deps.appsStorage.createOne.resolves({ id: "appId" } as any);
            deps.bundlesStorage.findLatestByNameAndTag.resolves({
                id: "bundleId"
            } as any);
            const deployBundle = new DeployBundle(deps);
            await deployBundle.exec({
                bundleNameTagCombination: "name:tag",
                appName: "appName",
                entrypointUrlMatcher: "example.com/"
            });
            expect(deps.operationLogsStorage.createOne).to.have.been.calledWith(
                sinon.match.has("operation", Operation.createApp)
            );
            expect(deps.operationLogsStorage.createOne).to.have.been.calledWith(
                sinon.match.has("operation", Operation.createEntrypoint)
            );
        });

        it("case: entrypoint created", async () => {
            const deps = getMockDependencies();
            deps.appsStorage.findOneByName.resolves({ id: "appId" } as any);
            deps.bundlesStorage.findLatestByNameAndTag.resolves({
                id: "bundleId"
            } as any);
            const deployBundle = new DeployBundle(deps);
            await deployBundle.exec({
                bundleNameTagCombination: "name:tag",
                appName: "appName",
                entrypointUrlMatcher: "example.com/"
            });
            expect(
                deps.operationLogsStorage.createOne
            ).to.have.been.calledOnceWith(
                sinon.match.has("operation", Operation.createEntrypoint)
            );
        });

        it("case: entrypoint updated", async () => {
            const deps = getMockDependencies();
            deps.appsStorage.findOneByName.resolves({ id: "appId" } as any);
            deps.entrypointsStorage.findOneByUrlMatcher.resolves({
                id: "entrypointId",
                appId: "appId"
            } as any);
            deps.bundlesStorage.findLatestByNameAndTag.resolves({
                id: "bundleId"
            } as any);
            const deployBundle = new DeployBundle(deps);
            await deployBundle.exec({
                bundleNameTagCombination: "name:tag",
                appName: "appName",
                entrypointUrlMatcher: "example.com/"
            });
            expect(
                deps.operationLogsStorage.createOne
            ).to.have.been.calledOnceWith(
                sinon.match.has("operation", Operation.updateEntrypoint)
            );
        });
    });
});
