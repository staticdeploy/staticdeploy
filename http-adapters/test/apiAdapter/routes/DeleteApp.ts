import { expect } from "chai";
import sinon from "sinon";
import request from "supertest";

import { getApiAdapterServer } from "../../testUtils";

describe("apiAdapter DELETE /apps/:appId", () => {
    it("204 on app deleted, deletes the app", async () => {
        const execMock = sinon.stub().resolves();
        const server = getApiAdapterServer({ deleteApp: execMock });
        await request(server)
            .delete("/apps/id")
            .expect(204);
        expect(execMock).to.have.been.calledOnceWith("id");
    });
});
