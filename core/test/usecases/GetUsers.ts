import { expect } from "chai";

import GetUsers from "../../src/usecases/GetUsers";
import { getMockDependencies } from "../testUtils";

describe("usecase GetUsers", () => {
    it("returns the users found with the specified search filters (none for now)", async () => {
        const deps = getMockDependencies();
        const mockUsers = [] as any;
        deps.storages.users.findMany.resolves(mockUsers);
        const getUsers = new GetUsers(deps);
        const users = await getUsers.exec();
        expect(users).to.equal(mockUsers);
    });
});
