import { expect } from "chai";
import sinon from "sinon";

import {
    SomeGroupNotFoundError,
    UserNotFoundError
} from "../../src/common/functionalErrors";
import { Operation } from "../../src/entities/OperationLog";
import UpdateUser from "../../src/usecases/UpdateUser";
import { getMockDependencies } from "../testUtils";

describe("usecase UpdateUser", () => {
    it("throws UserNotFoundError if no user with the specified id exists", async () => {
        const updateUser = new UpdateUser(getMockDependencies());
        const updateUserPromise = updateUser.exec("userId", {});
        await expect(updateUserPromise).to.be.rejectedWith(UserNotFoundError);
        await expect(updateUserPromise).to.be.rejectedWith(
            "No user found with id = userId"
        );
    });

    it("throws SomeGroupNotFoundError if not all of the specified group ids correspond to an existing group", async () => {
        const deps = getMockDependencies();
        deps.storages.users.findOne.resolves({} as any);
        deps.storages.groups.allExistWithIds.resolves(false);
        const updateUser = new UpdateUser(deps);
        const updateUserPromise = updateUser.exec("userId", {
            groupsIds: ["groupId"]
        });
        await expect(updateUserPromise).to.be.rejectedWith(
            SomeGroupNotFoundError
        );
        await expect(updateUserPromise).to.be.rejectedWith(
            "Not all ids = [ groupId ] correspond to an existing group"
        );
    });

    it("updates the user", async () => {
        const deps = getMockDependencies();
        deps.storages.users.findOne.resolves({} as any);
        const updateUser = new UpdateUser(deps);
        await updateUser.exec("userId", { name: "name" });
        expect(deps.storages.users.updateOne).to.have.been.calledOnceWith(
            "userId",
            {
                name: "name",
                groupsIds: undefined,
                updatedAt: sinon.match.date
            }
        );
    });

    it("logs the update user operation", async () => {
        const deps = getMockDependencies();
        deps.storages.users.findOne.resolves({} as any);
        const updateUser = new UpdateUser(deps);
        await updateUser.exec("userId", {});
        expect(
            deps.storages.operationLogs.createOne
        ).to.have.been.calledOnceWith(
            sinon.match.has("operation", Operation.UpdateUser)
        );
    });

    it("returns the updated user", async () => {
        const deps = getMockDependencies();
        const mockUpdatedUser = {} as any;
        deps.storages.users.findOne.resolves({} as any);
        deps.storages.users.updateOne.resolves(mockUpdatedUser);
        const updateUser = new UpdateUser(deps);
        const updatedUser = await updateUser.exec("userId", {});
        expect(updatedUser).to.equal(mockUpdatedUser);
    });
});
