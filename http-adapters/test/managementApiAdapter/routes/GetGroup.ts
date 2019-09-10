import sinon from "sinon";
import request from "supertest";

import { getManagementApiAdapter } from "../../testUtils";

describe("managementApiAdapter GET /groups/:groupId", () => {
    it("200 and returns the group", () => {
        const execMock = sinon.stub().resolves({ id: "id" });
        const server = getManagementApiAdapter({ getGroup: execMock });
        return request(server)
            .get("/groups/id")
            .expect(200)
            .expect({ id: "id" });
    });
});
