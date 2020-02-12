import { expect } from "chai";
import sinon from "sinon";

import {
    ConflictingUserError,
    SomeGroupNotFoundError
} from "../../src/common/functionalErrors";
import { Operation } from "../../src/entities/OperationLog";
import { UserType } from "../../src/entities/User";
import CreateUser from "../../src/usecases/CreateUser";
import { getMockDependencies } from "../testUtils";

describe("usecase CreateUser", () => {
    it("throws ConflictingUserError if a user with the same idp / idpId combination exists", async () => {
        const deps = getMockDependencies();
        deps.storages.users.oneExistsWithIdpAndIdpId.resolves(true);
        const createUser = new CreateUser(deps);
        const createUserPromise = createUser.exec({
            idp: "idp",
            idpId: "idpId",
            type: UserType.Human,
            name: "name",
            groupsIds: []
        });
        await expect(createUserPromise).to.be.rejectedWith(
            ConflictingUserError
        );
        await expect(createUserPromise).to.be.rejectedWith(
            "A user with idp = idp and idpId = idpId already exists"
        );
    });

    it("throws SomeGroupNotFoundError if not all of the specified group ids correspond to an existing group", async () => {
        const deps = getMockDependencies();
        deps.storages.groups.allExistWithIds.resolves(false);
        const createUser = new CreateUser(deps);
        const createUserPromise = createUser.exec({
            idp: "idp",
            idpId: "idpId",
            type: UserType.Human,
            name: "name",
            groupsIds: ["groupId"]
        });
        await expect(createUserPromise).to.be.rejectedWith(
            SomeGroupNotFoundError
        );
        await expect(createUserPromise).to.be.rejectedWith(
            "Not all ids = [ groupId ] correspond to an existing group"
        );
    });

    it("creates a user", async () => {
        const deps = getMockDependencies();
        deps.storages.groups.allExistWithIds.resolves(true);
        const createUser = new CreateUser(deps);
        await createUser.exec({
            idp: "idp",
            idpId: "idpId",
            type: UserType.Human,
            name: "name",
            groupsIds: ["groupId"]
        });
        expect(deps.storages.users.createOne).to.have.been.calledOnceWith({
            id: sinon.match.string,
            idp: "idp",
            idpId: "idpId",
            type: UserType.Human,
            name: "name",
            groupsIds: ["groupId"],
            createdAt: sinon.match.date,
            updatedAt: sinon.match.date
        });
    });

    it("logs the create user operation", async () => {
        const deps = getMockDependencies();
        const createUser = new CreateUser(deps);
        await createUser.exec({
            idp: "idp",
            idpId: "idpId",
            type: UserType.Human,
            name: "name",
            groupsIds: []
        });
        expect(
            deps.storages.operationLogs.createOne
        ).to.have.been.calledOnceWith(
            sinon.match.has("operation", Operation.CreateUser)
        );
    });

    it("returns the created user", async () => {
        const deps = getMockDependencies();
        const mockCreatedUser = {} as any;
        deps.storages.users.createOne.resolves(mockCreatedUser);
        const createUser = new CreateUser(deps);
        const createdUser = await createUser.exec({
            idp: "idp",
            idpId: "idpId",
            type: UserType.Human,
            name: "name",
            groupsIds: []
        });
        expect(createdUser).to.equal(mockCreatedUser);
    });
});
