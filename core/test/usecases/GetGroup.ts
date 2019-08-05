import { expect } from "chai";

import { GroupNotFoundError } from "../../src/common/errors";
import GetGroup from "../../src/usecases/GetGroup";
import { getMockDependencies } from "../testUtils";

describe("usecase GetGroup", () => {
    it("throws GroupNotFoundError if a group with the specified id doesn't exist", async () => {
        const getGroup = new GetGroup(getMockDependencies());
        const getGroupPromise = getGroup.exec("groupId");
        await expect(getGroupPromise).to.be.rejectedWith(GroupNotFoundError);
        await expect(getGroupPromise).to.be.rejectedWith(
            "No group found with id = groupId"
        );
    });

    it("returns the group with the specified id", async () => {
        const deps = getMockDependencies();
        const mockGroup = {} as any;
        deps.storages.groups.findOne.resolves(mockGroup);
        const getGroup = new GetGroup(deps);
        const group = await getGroup.exec("groupId");
        expect(group).to.equal(mockGroup);
    });
});
