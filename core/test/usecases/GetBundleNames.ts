import { expect } from "chai";

import GetBundleNames from "../../src/usecases/GetBundleNames";
import { getMockDependencies } from "../testUtils";

describe("usecase GetBundleNames", () => {
    it("returns all the (unique) names of the stored bundles", async () => {
        const deps = getMockDependencies();
        const mockBundleNames = [] as any;
        deps.storages.bundles.findManyNames.resolves(mockBundleNames);
        const getBundleNames = new GetBundleNames(deps);
        const bundleNames = await getBundleNames.exec();
        expect(bundleNames).to.equal(mockBundleNames);
    });
});
