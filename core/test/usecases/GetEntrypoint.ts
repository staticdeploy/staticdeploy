import { expect } from "chai";

import {
    AuthenticationRequiredError,
    EntrypointNotFoundError
} from "../../src/common/errors";
import GetEntrypoint from "../../src/usecases/GetEntrypoint";
import { getMockDependencies } from "../testUtils";

describe("usecase GetEntrypoint", () => {
    it("throws AuthenticationRequiredError if the request is not authenticated", async () => {
        const deps = getMockDependencies();
        deps.requestContext.userId = null;
        const getEntrypoint = new GetEntrypoint(deps);
        const getEntrypointPromise = getEntrypoint.exec("entrypointId");
        await expect(getEntrypointPromise).to.be.rejectedWith(
            AuthenticationRequiredError
        );
        await expect(getEntrypointPromise).to.be.rejectedWith(
            "This operation requires the request to be authenticated"
        );
    });

    it("throws EntrypointNotFound if an entrypoint with the specified id doesn't exist", async () => {
        const getEntrypoint = new GetEntrypoint(getMockDependencies());
        const getEntrypointPromise = getEntrypoint.exec("entrypointId");
        await expect(getEntrypointPromise).to.be.rejectedWith(
            EntrypointNotFoundError
        );
        await expect(getEntrypointPromise).to.be.rejectedWith(
            "No entrypoint found with id = entrypointId"
        );
    });

    it("returns the entrypoint with the specified id", async () => {
        const deps = getMockDependencies();
        const mockEntrypoint = {} as any;
        deps.entrypointsStorage.findOne.resolves(mockEntrypoint);
        const getEntrypoint = new GetEntrypoint(deps);
        const entrypoint = await getEntrypoint.exec("entrypointId");
        expect(entrypoint).to.equal(mockEntrypoint);
    });
});
