import sinon from "sinon";
import request from "supertest";

import { getManagementApiAdapter } from "../../testUtils";

describe("managementApiAdapter GET /operationLogs", () => {
    it("200 and returns all operationLogs", () => {
        const execMock = sinon.stub().resolves([]);
        const server = getManagementApiAdapter({ getOperationLogs: execMock });
        return request(server)
            .get("/operationLogs")
            .expect(200)
            .expect([]);
    });
});
