import { expect } from "chai";
import sinon from "sinon";
import request from "supertest";

import { getManagementApiAdapter } from "../../testUtils";

describe("managementApiAdapter DELETE /groups/:groupId", () => {
    it("204 on group deleted, deletes the group", async () => {
        const execMock = sinon.stub().resolves();
        const server = getManagementApiAdapter({ deleteGroup: execMock });
        await request(server)
            .delete("/groups/id")
            .expect(204);
        expect(execMock).to.have.been.calledOnceWith("id");
    });
});
