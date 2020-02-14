import { expect } from "chai";
import sinon from "sinon";

import { UserNotFoundError } from "../../src/common/functionalErrors";
import { Operation } from "../../src/entities/OperationLog";
import DeleteUser from "../../src/usecases/DeleteUser";
import { getMockDependencies } from "../testUtils";

describe("usecase DeleteUser", () => {
    it("throws UserNotFoundError if no user with the specified id exists", async () => {
        const deleteUser = new DeleteUser(getMockDependencies());
        const deleteUserPromise = deleteUser.exec("userId");
        await expect(deleteUserPromise).to.be.rejectedWith(UserNotFoundError);
        await expect(deleteUserPromise).to.be.rejectedWith(
            "No user found with id = userId"
        );
    });

    it("deletes the user", async () => {
        const deps = getMockDependencies();
        deps.storages.users.findOne.resolves({} as any);
        const deleteUser = new DeleteUser(deps);
        await deleteUser.exec("userId");
        expect(deps.storages.users.deleteOne).to.have.been.calledOnceWith(
            "userId"
        );
    });

    it("logs the delete user operation", async () => {
        const deps = getMockDependencies();
        deps.storages.users.findOne.resolves({} as any);
        const deleteUser = new DeleteUser(deps);
        await deleteUser.exec("userId");
        expect(
            deps.storages.operationLogs.createOne
        ).to.have.been.calledOnceWith(
            sinon.match.has("operation", Operation.DeleteUser)
        );
    });
});
