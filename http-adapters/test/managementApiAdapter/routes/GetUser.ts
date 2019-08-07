import sinon from "sinon";
import request from "supertest";

import { getManagementApiAdapter } from "../../testUtils";

describe("managementApiAdapter GET /users/:userId", () => {
    it("200 and returns the user", () => {
        const execMock = sinon.stub().resolves({ id: "id" });
        const server = getManagementApiAdapter({ getUser: execMock });
        return request(server)
            .get("/users/id")
            .expect(200)
            .expect({ id: "id" });
    });
});
