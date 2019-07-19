import { expect } from "chai";
import sinon from "sinon";
import request from "supertest";

import { getApiAdapterServer } from "../../testUtils";

describe("apiAdapter GET /entrypoints?appId", () => {
    it("400 on missing query parameter appId", () => {
        const server = getApiAdapterServer({});
        return request(server)
            .get("/entrypoints")
            .expect(400)
            .expect(/Validation failed/);
    });

    it("200 and returns the filtered entrypoints", async () => {
        const execMock = sinon.stub().resolves([]);
        const server = getApiAdapterServer({ getEntrypointsByAppId: execMock });
        await request(server)
            .get("/entrypoints?appId=appId")
            .expect(200)
            .expect([]);
        expect(execMock).to.have.been.calledOnceWith("appId");
    });
});
