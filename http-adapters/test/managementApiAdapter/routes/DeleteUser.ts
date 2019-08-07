import { expect } from "chai";
import sinon from "sinon";
import request from "supertest";

import { getManagementApiAdapter } from "../../testUtils";

describe("managementApiAdapter DELETE /users/:userId", () => {
    it("204 on user deleted, deletes the user", async () => {
        const execMock = sinon.stub().resolves();
        const server = getManagementApiAdapter({ deleteUser: execMock });
        await request(server)
            .delete("/users/id")
            .expect(204);
        expect(execMock).to.have.been.calledOnceWith("id");
    });
});
