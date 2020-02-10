import sinon from "sinon";
import request from "supertest";

import { getManagementApiAdapter } from "../../testUtils";

describe("managementApiAdapter GET /supportedExternalCacheTypes", () => {
    it("200 and returns all supported externalCacheTypes", () => {
        const execMock = sinon.stub().resolves([]);
        const server = getManagementApiAdapter({
            getSupportedExternalCacheTypes: execMock
        });
        return request(server)
            .get("/supportedExternalCacheTypes")
            .expect(200)
            .expect([]);
    });
});
