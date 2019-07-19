import sinon from "sinon";
import request from "supertest";

import { getApiAdapterServer } from "../../testUtils";

describe("apiAdapter GET /bundles/:bundleId", () => {
    it("200 and returns the bundle", () => {
        const execMock = sinon.stub().resolves({ id: "id" });
        const server = getApiAdapterServer({ getBundle: execMock });
        return request(server)
            .get("/bundles/id")
            .expect(200)
            .expect({ id: "id" });
    });
});
