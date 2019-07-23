import sinon from "sinon";
import request from "supertest";

import { getManagementApiAdapter } from "../../testUtils";

describe("managementApiAdapter GET /apps", () => {
    it("200 and returns all apps", () => {
        const execMock = sinon.stub().resolves([]);
        const server = getManagementApiAdapter({ getApps: execMock });
        return request(server)
            .get("/apps")
            .expect(200)
            .expect([]);
    });
});
