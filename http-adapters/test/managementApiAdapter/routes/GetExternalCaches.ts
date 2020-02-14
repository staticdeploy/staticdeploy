import sinon from "sinon";
import request from "supertest";

import { getManagementApiAdapter } from "../../testUtils";

describe("managementApiAdapter GET /externalCaches", () => {
    it("200 and returns all externalCaches", () => {
        const execMock = sinon.stub().resolves([]);
        const server = getManagementApiAdapter({ getExternalCaches: execMock });
        return request(server)
            .get("/externalCaches")
            .expect(200)
            .expect([]);
    });
});
