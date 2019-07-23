import sinon from "sinon";
import request from "supertest";

import { getManagementApiAdapter } from "../../testUtils";

describe("managementApiAdapter GET /bundles", () => {
    it("200 and returns all bundles", () => {
        const execMock = sinon.stub().resolves([]);
        const server = getManagementApiAdapter({ getBundles: execMock });
        return request(server)
            .get("/bundles")
            .expect(200)
            .expect([]);
    });
});
