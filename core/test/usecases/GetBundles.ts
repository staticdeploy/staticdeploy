import { expect } from "chai";

import GetBundles from "../../src/usecases/GetBundles";
import { getMockDependencies } from "../testUtils";

describe("usecase GetBundles", () => {
    it("returns the bundles found with the specified search filters (none for now)", async () => {
        const deps = getMockDependencies();
        const mockBundles = [] as any;
        deps.storages.bundles.findMany.resolves(mockBundles);
        const getBundles = new GetBundles(deps);
        const bundles = await getBundles.exec();
        expect(bundles).to.equal(mockBundles);
    });
});
