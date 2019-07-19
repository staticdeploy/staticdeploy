import sinon from "sinon";
import request from "supertest";

import { getApiAdapterServer } from "../../testUtils";

describe("apiAdapter GET /apps/:appId", () => {
    it("200 and returns the app", () => {
        const execMock = sinon.stub().resolves({ id: "id" });
        const server = getApiAdapterServer({ getApp: execMock });
        return request(server)
            .get("/apps/id")
            .expect(200)
            .expect({ id: "id" });
    });
});
