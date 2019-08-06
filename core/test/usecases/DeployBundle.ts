import { expect } from "chai";
import sinon from "sinon";

import {
    BundleNameTagCombinationNotValidError,
    BundleNotFoundError,
    EntrypointMismatchedAppIdError
} from "../../src/common/errors";
import DeployBundle from "../../src/usecases/DeployBundle";
import { getMockDependencies } from "../testUtils";

describe("usecase DeployBundle", () => {
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
        deps.storages.bundles.findLatestByNameAndTag.resolves({} as any);
        deps.storages.entrypoints.findOneByUrlMatcher.resolves({} as any);
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
        deps.storages.apps.findOneByName.resolves({ id: "appId" } as any);
        deps.storages.bundles.findLatestByNameAndTag.resolves({} as any);
        deps.storages.entrypoints.findOneByUrlMatcher.resolves({
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

    it("creates the app and the entrypoint if they don't exist", async () => {
        const deps = getMockDependencies();
        // Stub deps used directly by DeployBundle
        deps.storages.bundles.findLatestByNameAndTag.resolves({
            id: "bundleId"
        } as any);
        // Stub deps used by other usecases called by DeployBundle
        deps.storages.apps.createOne.resolves({ id: "appId" } as any);
        deps.storages.apps.oneExistsWithId.resolves(true);
        deps.storages.bundles.oneExistsWithId.resolves(true);
        const deployBundle = new DeployBundle(deps);
        await deployBundle.exec({
            bundleNameTagCombination: "name:tag",
            appName: "appName",
            entrypointUrlMatcher: "example.com/"
        });
        expect(deps.storages.apps.createOne).to.have.been.calledOnceWith({
            id: sinon.match.string,
            name: "appName",
            defaultConfiguration: {},
            createdAt: sinon.match.date,
            updatedAt: sinon.match.date
        });
        expect(deps.storages.entrypoints.createOne).to.have.been.calledOnceWith(
            {
                id: sinon.match.string,
                urlMatcher: "example.com/",
                appId: "appId",
                bundleId: "bundleId",
                configuration: null,
                redirectTo: null,
                createdAt: sinon.match.date,
                updatedAt: sinon.match.date
            }
        );
    });

    it("creates the entrypoint if it doesn't exist", async () => {
        const deps = getMockDependencies();
        // Stub deps used directly by DeployBundle
        deps.storages.apps.findOneByName.resolves({ id: "appId" } as any);
        deps.storages.bundles.findLatestByNameAndTag.resolves({
            id: "bundleId"
        } as any);
        // Stub deps used by other usecases called by DeployBundle
        deps.storages.apps.oneExistsWithId.resolves(true);
        deps.storages.bundles.oneExistsWithId.resolves(true);
        const deployBundle = new DeployBundle(deps);
        await deployBundle.exec({
            bundleNameTagCombination: "name:tag",
            appName: "appName",
            entrypointUrlMatcher: "example.com/"
        });
        expect(deps.storages.entrypoints.createOne).to.have.been.calledOnceWith(
            {
                id: sinon.match.string,
                urlMatcher: "example.com/",
                appId: "appId",
                bundleId: "bundleId",
                configuration: null,
                redirectTo: null,
                createdAt: sinon.match.date,
                updatedAt: sinon.match.date
            }
        );
    });

    it("updates the entrypoint if it exist", async () => {
        const deps = getMockDependencies();
        // Stub deps used directly by DeployBundle
        deps.storages.apps.findOneByName.resolves({ id: "appId" } as any);
        deps.storages.entrypoints.findOneByUrlMatcher.resolves({
            id: "entrypointId",
            appId: "appId"
        } as any);
        deps.storages.bundles.findLatestByNameAndTag.resolves({
            id: "bundleId"
        } as any);
        // Stub deps used by other usecases called by DeployBundle
        deps.storages.entrypoints.findOne.resolves({
            id: "entrypointId"
        } as any);
        deps.storages.bundles.oneExistsWithId.resolves(true);
        const deployBundle = new DeployBundle(deps);
        await deployBundle.exec({
            bundleNameTagCombination: "name:tag",
            appName: "appName",
            entrypointUrlMatcher: "example.com/"
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
});
