import sinon from "sinon";
import request from "supertest";

import { getManagementApiAdapter } from "../../testUtils";

describe("managementApiAdapter GET /bundleNames/:bundleName/bundleTags", () => {
    it("200 and returns the filtered bundle tags", () => {
        const execMock = sinon.stub().resolves([]);
        const server = getManagementApiAdapter({
            getBundleTagsByBundleName: execMock,
        });
        return request(server)
            .get("/bundleNames/bundleName/bundleTags")
            .expect(200)
            .expect([]);
    });
});
