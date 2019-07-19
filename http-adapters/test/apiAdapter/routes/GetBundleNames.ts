import sinon from "sinon";
import request from "supertest";

import { getApiAdapterServer } from "../../testUtils";

describe("apiAdapter GET /bundleNames", () => {
    it("200 and returns all bundle names", () => {
        const execMock = sinon.stub().resolves([]);
        const server = getApiAdapterServer({ getBundleNames: execMock });
        return request(server)
            .get("/bundleNames")
            .expect(200)
            .expect([]);
    });
});
