import sinon from "sinon";
import request from "supertest";

import { getApiAdapterServer } from "../../testUtils";

describe("apiAdapter GET /health", () => {
    it("200 on healthy service", () => {
        const execMock = sinon.stub().resolves({ isHealthy: true });
        const server = getApiAdapterServer({ checkHealth: execMock });
        return request(server)
            .get("/health")
            .expect(200)
            .expect({ isHealthy: true });
    });

    it("503 on unhealthy service", () => {
        const execMock = sinon.stub().resolves({ isHealthy: false });
        const server = getApiAdapterServer({ checkHealth: execMock });
        return request(server)
            .get("/health")
            .expect(503)
            .expect({ isHealthy: false });
    });
});
