import { expect } from "chai";
import sinon from "sinon";
import request from "supertest";

import { getManagementApiAdapter } from "../../testUtils";

describe("managementApiAdapter POST /externalCaches", () => {
    it("400 on invalid request body", () => {
        const server = getManagementApiAdapter({});
        return request(server)
            .post("/externalCaches")
            .send({})
            .expect(400)
            .expect(/Validation failed/);
    });

    it("201 on externalCache created, creates and returns the externalCache", async () => {
        const execMock = sinon.stub().resolves({
            domain: "domain.com",
            type: "type",
            configuration: {}
        });
        const server = getManagementApiAdapter({
            createExternalCache: execMock
        });
        await request(server)
            .post("/externalCaches")
            .send({ domain: "domain.com", type: "type", configuration: {} })
            .expect(201)
            .expect({ domain: "domain.com", type: "type", configuration: {} });
        expect(execMock).to.have.been.calledOnceWith({
            domain: "domain.com",
            type: "type",
            configuration: {}
        });
    });
});
