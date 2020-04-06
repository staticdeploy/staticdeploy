import { expect } from "chai";
import sinon from "sinon";

import {
    GroupHasUsersError,
    GroupNotFoundError,
} from "../../src/common/errors";
import { Operation } from "../../src/entities/OperationLog";
import DeleteGroup from "../../src/usecases/DeleteGroup";
import { getMockDependencies } from "../testUtils";

describe("usecase DeleteGroup", () => {
    it("throws GroupNotFoundError if no group with the specified id exists", async () => {
        const deleteGroup = new DeleteGroup(getMockDependencies());
        const deleteGroupPromise = deleteGroup.exec("groupId");
        await expect(deleteGroupPromise).to.be.rejectedWith(GroupNotFoundError);
        await expect(deleteGroupPromise).to.be.rejectedWith(
            "No group found with id = groupId"
        );
    });

    it("throws GroupHasUsersError if the group has linked users", async () => {
        const deps = getMockDependencies();
        deps.storages.groups.findOne.resolves({} as any);
        deps.storages.users.anyExistsWithGroup.resolves(true);
        const deleteGroup = new DeleteGroup(deps);
        const deleteGroupPromise = deleteGroup.exec("groupId");
        await expect(deleteGroupPromise).to.be.rejectedWith(GroupHasUsersError);
        await expect(deleteGroupPromise).to.be.rejectedWith(
            "Can't delete group with id = groupId because it has linked users"
        );
    });

    it("deletes the group", async () => {
        const deps = getMockDependencies();
        deps.storages.groups.findOne.resolves({} as any);
        const deleteGroup = new DeleteGroup(deps);
        await deleteGroup.exec("groupId");
        expect(deps.storages.groups.deleteOne).to.have.been.calledOnceWith(
            "groupId"
        );
    });

    it("logs the delete group operation", async () => {
        const deps = getMockDependencies();
        deps.storages.groups.findOne.resolves({} as any);
        const deleteGroup = new DeleteGroup(deps);
        await deleteGroup.exec("groupId");
        expect(
            deps.storages.operationLogs.createOne
        ).to.have.been.calledOnceWith(
            sinon.match.has("operation", Operation.DeleteGroup)
        );
    });
});
