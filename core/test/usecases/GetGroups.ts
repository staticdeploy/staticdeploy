import { expect } from "chai";

import GetGroups from "../../src/usecases/GetGroups";
import { getMockDependencies } from "../testUtils";

describe("usecase GetGroups", () => {
    it("returns the groups found with the specified search filters (none for now)", async () => {
        const deps = getMockDependencies();
        const mockGroups = [] as any;
        deps.storages.groups.findMany.resolves(mockGroups);
        const getGroups = new GetGroups(deps);
        const groups = await getGroups.exec();
        expect(groups).to.equal(mockGroups);
    });
});
