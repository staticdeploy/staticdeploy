import { expect } from "chai";
import sinon from "sinon";
import request from "supertest";

import { getManagementApiAdapter } from "../../testUtils";

describe("managementApiAdapter GET /entrypoints?appId", () => {
    it("400 on missing query parameter appId", () => {
        const server = getManagementApiAdapter({});
        return request(server)
            .get("/entrypoints")
            .expect(400)
            .expect(/Validation failed/);
    });

    it("200 and returns the filtered entrypoints", async () => {
        const execMock = sinon.stub().resolves([]);
        const server = getManagementApiAdapter({
            getEntrypointsByAppId: execMock
        });
        await request(server)
            .get("/entrypoints?appId=appId")
            .expect(200)
            .expect([]);
        expect(execMock).to.have.been.calledOnceWith("appId");
    });
});
