import sinon from "sinon";
import request from "supertest";

import { getManagementApiAdapter } from "../../testUtils";

describe("managementApiAdapter GET /groups", () => {
    it("200 and returns all groups", () => {
        const execMock = sinon.stub().resolves([]);
        const server = getManagementApiAdapter({ getGroups: execMock });
        return request(server).get("/groups").expect(200).expect([]);
    });
});
