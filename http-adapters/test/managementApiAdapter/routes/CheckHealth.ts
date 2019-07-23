import sinon from "sinon";
import request from "supertest";

import { getManagementApiAdapter } from "../../testUtils";

describe("managementApiAdapter GET /health", () => {
    it("200 on healthy service", () => {
        const execMock = sinon.stub().resolves({ isHealthy: true });
        const server = getManagementApiAdapter({ checkHealth: execMock });
        return request(server)
            .get("/health")
            .expect(200)
            .expect({ isHealthy: true });
    });

    it("503 on unhealthy service", () => {
        const execMock = sinon.stub().resolves({ isHealthy: false });
        const server = getManagementApiAdapter({ checkHealth: execMock });
        return request(server)
            .get("/health")
            .expect(503)
            .expect({ isHealthy: false });
    });
});
