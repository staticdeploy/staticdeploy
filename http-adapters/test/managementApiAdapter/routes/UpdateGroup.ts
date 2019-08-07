import { expect } from "chai";
import sinon from "sinon";
import request from "supertest";

import { getManagementApiAdapter } from "../../testUtils";

describe("managementApiAdapter PATCH /groups/:groupId", () => {
    it("400 on invalid request body", () => {
        const server = getManagementApiAdapter({});
        return request(server)
            .patch("/groups/id")
            .send({ invalidKey: "invalidKey" })
            .expect(400)
            .expect(/Validation failed/);
    });

    it("200 on group updated, updates group and returns it", async () => {
        const execMock = sinon.stub().resolves({ name: "newName" });
        const server = getManagementApiAdapter({ updateGroup: execMock });
        await request(server)
            .patch("/groups/id")
            .send({ name: "newName" })
            .expect(200)
            .expect({ name: "newName" });
        expect(execMock).to.have.been.calledOnceWith("id", { name: "newName" });
    });
});
