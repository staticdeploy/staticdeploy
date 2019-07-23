import sinon from "sinon";
import request from "supertest";

import { getManagementApiAdapter } from "../../testUtils";

describe("managementApiAdapter GET /entrypoints/:entrypointId", () => {
    it("200 and returns the entrypoint", () => {
        const execMock = sinon.stub().resolves({ id: "id" });
        const server = getManagementApiAdapter({ getEntrypoint: execMock });
        return request(server)
            .get("/entrypoints/id")
            .expect(200)
            .expect({ id: "id" });
    });
});
