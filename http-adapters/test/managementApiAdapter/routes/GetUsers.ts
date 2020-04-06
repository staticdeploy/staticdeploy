import sinon from "sinon";
import request from "supertest";

import { getManagementApiAdapter } from "../../testUtils";

describe("managementApiAdapter GET /users", () => {
    it("200 and returns all users", () => {
        const execMock = sinon.stub().resolves([]);
        const server = getManagementApiAdapter({ getUsers: execMock });
        return request(server).get("/users").expect(200).expect([]);
    });
});
