import sinon from "sinon";
import request from "supertest";

import { getManagementApiAdapter } from "../../testUtils";

describe("managementApiAdapter GET /bundleNames", () => {
    it("200 and returns all bundle names", () => {
        const execMock = sinon.stub().resolves([]);
        const server = getManagementApiAdapter({ getBundleNames: execMock });
        return request(server)
            .get("/bundleNames")
            .expect(200)
            .expect([]);
    });
});
