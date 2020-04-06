import { expect } from "chai";
import sinon from "sinon";
import request from "supertest";

import { getManagementApiAdapter } from "../../testUtils";

describe("managementApiAdapter DELETE /apps/:appId", () => {
    it("204 on app deleted, deletes the app", async () => {
        const execMock = sinon.stub().resolves();
        const server = getManagementApiAdapter({ deleteApp: execMock });
        await request(server).delete("/apps/id").expect(204);
        expect(execMock).to.have.been.calledOnceWith("id");
    });
});
