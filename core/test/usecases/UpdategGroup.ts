import { expect } from "chai";
import sinon from "sinon";

import {
    ConflictingGroupError,
    GroupNotFoundError,
    RoleNotValidError
} from "../../src/common/functionalErrors";
import { Operation } from "../../src/entities/OperationLog";
import UpdateGroup from "../../src/usecases/UpdateGroup";
import { getMockDependencies } from "../testUtils";

describe("usecase UpdateGroup", () => {
    it("throws RoleNotValidError if one of the roles is not valid", async () => {
        const updateGroup = new UpdateGroup(getMockDependencies());
        const updateGroupPromise = updateGroup.exec("groupId", {
            roles: ["not-valid"]
        });
        await expect(updateGroupPromise).to.be.rejectedWith(RoleNotValidError);
        await expect(updateGroupPromise).to.be.rejectedWith(
            "not-valid is not a valid role"
        );
    });

    it("throws GroupNotFoundError if no group with the specified id exists", async () => {
        const updateGroup = new UpdateGroup(getMockDependencies());
        const updateGroupPromise = updateGroup.exec("groupId", {});
        await expect(updateGroupPromise).to.be.rejectedWith(GroupNotFoundError);
        await expect(updateGroupPromise).to.be.rejectedWith(
            "No group found with id = groupId"
        );
    });

    it("throws ConflictingGroupError if an group with the same (to be updated) name exists", async () => {
        const deps = getMockDependencies();
        deps.storages.groups.findOne.resolves({} as any);
        deps.storages.groups.oneExistsWithName.resolves(true);
        const updateGroup = new UpdateGroup(deps);
        const updateGroupPromise = updateGroup.exec("groupId", {
            name: "name"
        });
        await expect(updateGroupPromise).to.be.rejectedWith(
            ConflictingGroupError
        );
        await expect(updateGroupPromise).to.be.rejectedWith(
            "A group with name = name already exists"
        );
    });

    it("updates the group", async () => {
        const deps = getMockDependencies();
        deps.storages.groups.findOne.resolves({} as any);
        const updateGroup = new UpdateGroup(deps);
        await updateGroup.exec("groupId", { roles: ["root"] });
        expect(deps.storages.groups.updateOne).to.have.been.calledOnceWith(
            "groupId",
            {
                name: undefined,
                roles: ["root"],
                updatedAt: sinon.match.date
            }
        );
    });

    it("logs the update group operation", async () => {
        const deps = getMockDependencies();
        deps.storages.groups.findOne.resolves({} as any);
        const updateGroup = new UpdateGroup(deps);
        await updateGroup.exec("groupId", {});
        expect(
            deps.storages.operationLogs.createOne
        ).to.have.been.calledOnceWith(
            sinon.match.has("operation", Operation.UpdateGroup)
        );
    });

    it("returns the updated group", async () => {
        const deps = getMockDependencies();
        const mockUpdatedGroup = {} as any;
        deps.storages.groups.findOne.resolves({} as any);
        deps.storages.groups.updateOne.resolves(mockUpdatedGroup);
        const updateGroup = new UpdateGroup(deps);
        const updatedGroup = await updateGroup.exec("groupId", {});
        expect(updatedGroup).to.equal(mockUpdatedGroup);
    });
});
