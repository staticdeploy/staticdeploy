import { expect } from "chai";
import sinon from "sinon";
import request from "supertest";

import { getManagementApiAdapter } from "../../testUtils";

describe("managementApiAdapter PATCH /entrypoints/:entrypointId", () => {
    it("400 on invalid request body", () => {
        const server = getManagementApiAdapter({});
        return request(server)
            .patch("/entrypoints/id")
            .send({ invalidKey: "invalidKey" })
            .expect(400)
            .expect(/Validation failed/);
    });

    it("200 on entrypoint updated, updates entrypoint and returns it", async () => {
        const execMock = sinon.stub().resolves({ urlMatcher: "example.com/" });
        const server = getManagementApiAdapter({ updateEntrypoint: execMock });
        await request(server)
            .patch("/entrypoints/id")
            .send({ urlMatcher: "example.com/" })
            .expect(200)
            .expect({ urlMatcher: "example.com/" });
        expect(execMock).to.have.been.calledOnceWith("id", {
            urlMatcher: "example.com/"
        });
    });
});
