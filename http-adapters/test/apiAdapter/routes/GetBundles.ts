import sinon from "sinon";
import request from "supertest";

import { getApiAdapterServer } from "../../testUtils";

describe("apiAdapter GET /bundles", () => {
    it("200 and returns all bundles", () => {
        const execMock = sinon.stub().resolves([]);
        const server = getApiAdapterServer({ getBundles: execMock });
        return request(server)
            .get("/bundles")
            .expect(200)
            .expect([]);
    });
});
