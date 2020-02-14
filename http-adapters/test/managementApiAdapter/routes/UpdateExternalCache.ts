import { expect } from "chai";
import sinon from "sinon";
import request from "supertest";

import { getManagementApiAdapter } from "../../testUtils";

describe("managementApiAdapter PATCH /externalCaches/:externalCacheId", () => {
    it("400 on invalid request body", () => {
        const server = getManagementApiAdapter({});
        return request(server)
            .patch("/externalCaches/id")
            .send({ invalidKey: "invalidKey" })
            .expect(400)
            .expect(/Validation failed/);
    });

    it("200 on externalCache updated, updates externalCache and returns it", async () => {
        const execMock = sinon
            .stub()
            .resolves({ configuration: { newKey: "newValue" } });
        const server = getManagementApiAdapter({
            updateExternalCache: execMock
        });
        await request(server)
            .patch("/externalCaches/id")
            .send({ configuration: { newKey: "newValue" } })
            .expect(200)
            .expect({ configuration: { newKey: "newValue" } });
        expect(execMock).to.have.been.calledOnceWith("id", {
            configuration: { newKey: "newValue" }
        });
    });
});
