import sinon from "sinon";
import request from "supertest";

import { getApiAdapterServer } from "../../testUtils";

describe("apiAdapter GET /operationLogs", () => {
    it("200 and returns all operationLogs", () => {
        const execMock = sinon.stub().resolves([]);
        const server = getApiAdapterServer({ getOperationLogs: execMock });
        return request(server)
            .get("/operationLogs")
            .expect(200)
            .expect([]);
    });
});
