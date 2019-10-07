import { expect } from "chai";
import sinon from "sinon";
import request from "supertest";

import { getManagementApiAdapter } from "../../testUtils";

describe("managementApiAdapter PATCH /apps/:appId", () => {
    it("400 on invalid request body", () => {
        const server = getManagementApiAdapter({});
        return request(server)
            .patch("/apps/id")
            .send({ invalidKey: "invalidKey" })
            .expect(400)
            .expect(/Validation failed/);
    });

    it("200 on app updated, updates app and returns it", async () => {
        const execMock = sinon
            .stub()
            .resolves({ defaultConfiguration: { newKey: "newValue" } });
        const server = getManagementApiAdapter({ updateApp: execMock });
        await request(server)
            .patch("/apps/id")
            .send({ defaultConfiguration: { newKey: "newValue" } })
            .expect(200)
            .expect({ defaultConfiguration: { newKey: "newValue" } });
        expect(execMock).to.have.been.calledOnceWith("id", {
            defaultConfiguration: { newKey: "newValue" }
        });
    });
});
