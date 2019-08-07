import { expect } from "chai";
import sinon from "sinon";
import request from "supertest";

import { getManagementApiAdapter } from "../../testUtils";

describe("managementApiAdapter POST /groups", () => {
    it("400 on invalid request body", () => {
        const server = getManagementApiAdapter({});
        return request(server)
            .post("/groups")
            .send({})
            .expect(400)
            .expect(/Validation failed/);
    });

    it("201 on group created, creates and returns the group", async () => {
        const execMock = sinon
            .stub()
            .resolves({ name: "name", roles: ["role"] });
        const server = getManagementApiAdapter({ createGroup: execMock });
        await request(server)
            .post("/groups")
            .send({ name: "name", roles: ["role"] })
            .expect(201)
            .expect({ name: "name", roles: ["role"] });
        expect(execMock).to.have.been.calledOnceWith({
            name: "name",
            roles: ["role"]
        });
    });
});
