import { expect } from "chai";

import { EntrypointNotFoundError } from "../../src/common/functionalErrors";
import GetEntrypoint from "../../src/usecases/GetEntrypoint";
import { getMockDependencies } from "../testUtils";

describe("usecase GetEntrypoint", () => {
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
        deps.storages.entrypoints.findOne.resolves(mockEntrypoint);
        const getEntrypoint = new GetEntrypoint(deps);
        const entrypoint = await getEntrypoint.exec("entrypointId");
        expect(entrypoint).to.equal(mockEntrypoint);
    });
});
