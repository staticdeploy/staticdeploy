import sinon from "sinon";
import request from "supertest";

import { getManagementApiAdapter } from "../../testUtils";

describe("managementApiAdapter GET /bundles/:bundleId", () => {
    it("200 and returns the bundle", () => {
        const execMock = sinon.stub().resolves({ id: "id" });
        const server = getManagementApiAdapter({ getBundle: execMock });
        return request(server)
            .get("/bundles/id")
            .expect(200)
            .expect({ id: "id" });
    });
});
