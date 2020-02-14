import sinon from "sinon";
import request from "supertest";

import { getManagementApiAdapter } from "../../testUtils";

describe("managementApiAdapter GET /externalCaches/:externalCacheId", () => {
    it("200 and returns the externalCache", () => {
        const execMock = sinon.stub().resolves({ id: "id" });
        const server = getManagementApiAdapter({ getExternalCache: execMock });
        return request(server)
            .get("/externalCaches/id")
            .expect(200)
            .expect({ id: "id" });
    });
});
