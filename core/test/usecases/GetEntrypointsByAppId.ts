import { expect } from "chai";

import { AuthenticationRequiredError } from "../../src/common/errors";
import GetEntrypointsByAppId from "../../src/usecases/GetEntrypointsByAppId";
import { getMockDependencies } from "../testUtils";

describe("usecase GetEntrypointsByAppId", () => {
    it("throws AuthenticationRequiredError if the request is not authenticated", async () => {
        const deps = getMockDependencies();
        deps.requestContext.userId = null;
        const getEntrypoints = new GetEntrypointsByAppId(deps);
        const getEntrypointsPromise = getEntrypoints.exec("appId");
        await expect(getEntrypointsPromise).to.be.rejectedWith(
            AuthenticationRequiredError
        );
        await expect(getEntrypointsPromise).to.be.rejectedWith(
            "This operation requires the request to be authenticated"
        );
    });

    it("returns the entrypoints with the specified appId", async () => {
        const deps = getMockDependencies();
        const mockEntrypoints = [] as any;
        deps.entrypointsStorage.findManyByAppId.resolves(mockEntrypoints);
        const getEntrypoints = new GetEntrypointsByAppId(deps);
        const entrypoints = await getEntrypoints.exec("appId");
        expect(entrypoints).to.equal(mockEntrypoints);
    });
});
