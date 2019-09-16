import sinon from "sinon";
import request from "supertest";

import { getManagementApiAdapter } from "../../testUtils";

describe("managementApiAdapter GET /currentUser", () => {
    it("200 and returns the current user", () => {
        const execMock = sinon.stub().resolves({ id: "id" });
        const server = getManagementApiAdapter({ getCurrentUser: execMock });
        return request(server)
            .get("/currentUser")
            .expect(200)
            .expect({ id: "id" });
    });
});
