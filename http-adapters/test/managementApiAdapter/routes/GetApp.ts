import sinon from "sinon";
import request from "supertest";

import { getManagementApiAdapter } from "../../testUtils";

describe("managementApiAdapter GET /apps/:appId", () => {
    it("200 and returns the app", () => {
        const execMock = sinon.stub().resolves({ id: "id" });
        const server = getManagementApiAdapter({ getApp: execMock });
        return request(server).get("/apps/id").expect(200).expect({ id: "id" });
    });
});
