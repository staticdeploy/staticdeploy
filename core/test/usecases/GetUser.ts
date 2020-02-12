import { expect } from "chai";

import { UserNotFoundError } from "../../src/common/functionalErrors";
import GetUser from "../../src/usecases/GetUser";
import { getMockDependencies } from "../testUtils";

describe("usecase GetUser", () => {
    it("throws UserNotFoundError if a user with the specified id doesn't exist", async () => {
        const getUser = new GetUser(getMockDependencies());
        const getUserPromise = getUser.exec("userId");
        await expect(getUserPromise).to.be.rejectedWith(UserNotFoundError);
        await expect(getUserPromise).to.be.rejectedWith(
            "No user found with id = userId"
        );
    });

    it("returns the user with the specified id", async () => {
        const deps = getMockDependencies();
        const mockUser = {} as any;
        deps.storages.users.findOneWithGroups.resolves(mockUser);
        const getUser = new GetUser(deps);
        const user = await getUser.exec("userId");
        expect(user).to.equal(mockUser);
    });
});
