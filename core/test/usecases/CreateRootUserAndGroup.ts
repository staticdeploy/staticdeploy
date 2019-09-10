import { expect } from "chai";
import sinon from "sinon";

import { RoleName } from "../../src/entities/Role";
import { UserType } from "../../src/entities/User";
import CreateRootUserAndGroup, {
    ROOT_GROUP_NAME,
    ROOT_USER_IDP_ID,
    ROOT_USER_NAME
} from "../../src/usecases/CreateRootUserAndGroup";
import { getMockDependencies } from "../testUtils";

describe("usecase CreateRootUserAndGroup", () => {
    it("creates the root group if it doesn't exist", async () => {
        const { storages } = getMockDependencies();
        storages.groups.findOneByName.resolves(null);
        storages.groups.createOne.resolves({ id: "groupId" } as any);
        const createRootUserAndGroup = new CreateRootUserAndGroup(storages);
        await createRootUserAndGroup.exec("idp");
        expect(storages.groups.createOne).to.have.been.calledOnceWith({
            id: sinon.match.string,
            name: ROOT_GROUP_NAME,
            roles: [RoleName.Root],
            createdAt: sinon.match.date,
            updatedAt: sinon.match.date
        });
    });

    it("doesn't create the root group if it exists", async () => {
        const { storages } = getMockDependencies();
        storages.groups.findOneByName.resolves({ id: "groupId" } as any);
        const createRootUserAndGroup = new CreateRootUserAndGroup(storages);
        await createRootUserAndGroup.exec("idp");
        expect(storages.groups.createOne).to.have.callCount(0);
    });

    it("creates the root user if it doesn't exist", async () => {
        const { storages } = getMockDependencies();
        storages.groups.findOneByName.resolves({ id: "groupId" } as any);
        storages.users.oneExistsWithIdpAndIdpId.resolves(false);
        const createRootUserAndGroup = new CreateRootUserAndGroup(storages);
        await createRootUserAndGroup.exec("idp");
        expect(storages.users.createOne).to.have.been.calledOnceWith({
            id: sinon.match.string,
            idp: "idp",
            idpId: ROOT_USER_IDP_ID,
            type: UserType.Human,
            name: ROOT_USER_NAME,
            groupsIds: ["groupId"],
            createdAt: sinon.match.date,
            updatedAt: sinon.match.date
        });
    });

    it("doesn't create the root user if it exists", async () => {
        const { storages } = getMockDependencies();
        storages.groups.findOneByName.resolves({ id: "groupId" } as any);
        storages.users.oneExistsWithIdpAndIdpId.resolves(true);
        const createRootUserAndGroup = new CreateRootUserAndGroup(storages);
        await createRootUserAndGroup.exec("idp");
        expect(storages.users.createOne).to.have.callCount(0);
    });
});
