import sinon from "sinon";
import request from "supertest";

import { getApiAdapterServer } from "../../testUtils";

describe("apiAdapter GET /apps", () => {
    it("200 and returns all apps", () => {
        const execMock = sinon.stub().resolves([]);
        const server = getApiAdapterServer({ getApps: execMock });
        return request(server)
            .get("/apps")
            .expect(200)
            .expect([]);
    });
});
