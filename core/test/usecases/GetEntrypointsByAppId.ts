import { expect } from "chai";

import { AppNotFoundError } from "../../src/common/functionalErrors";
import GetEntrypointsByAppId from "../../src/usecases/GetEntrypointsByAppId";
import { getMockDependencies } from "../testUtils";

describe("usecase GetEntrypointsByAppId", () => {
    it("throws AppNotFoundError if no app exists with the specified appId", async () => {
        const deps = getMockDependencies();
        deps.storages.apps.oneExistsWithId.resolves(false);
        const getEntrypoints = new GetEntrypointsByAppId(deps);
        const getEntrypointsPromise = getEntrypoints.exec("appId");
        await expect(getEntrypointsPromise).to.be.rejectedWith(
            AppNotFoundError
        );
        await expect(getEntrypointsPromise).to.be.rejectedWith(
            "No app found with id = appId"
        );
    });

    it("returns the entrypoints with the specified appId", async () => {
        const deps = getMockDependencies();
        deps.storages.apps.oneExistsWithId.resolves(true);
        const mockEntrypoints = [] as any;
        deps.storages.entrypoints.findManyByAppId.resolves(mockEntrypoints);
        const getEntrypoints = new GetEntrypointsByAppId(deps);
        const entrypoints = await getEntrypoints.exec("appId");
        expect(entrypoints).to.equal(mockEntrypoints);
    });
});
