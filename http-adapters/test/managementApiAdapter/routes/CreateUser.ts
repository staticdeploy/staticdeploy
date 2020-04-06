import { expect } from "chai";
import sinon from "sinon";
import request from "supertest";

import { getManagementApiAdapter } from "../../testUtils";

describe("managementApiAdapter POST /users", () => {
    it("400 on invalid request body", () => {
        const server = getManagementApiAdapter({});
        return request(server)
            .post("/users")
            .send({})
            .expect(400)
            .expect(/Validation failed/);
    });

    it("201 on user created, creates and returns the user", async () => {
        const execMock = sinon.stub().resolves({});
        const server = getManagementApiAdapter({ createUser: execMock });
        await request(server)
            .post("/users")
            .send({
                idp: "idp",
                idpId: "idpId",
                type: "human",
                name: "name",
                groupsIds: [],
            })
            .expect(201)
            .expect({});
        expect(execMock).to.have.been.calledOnceWith({
            idp: "idp",
            idpId: "idpId",
            type: "human",
            name: "name",
            groupsIds: [],
        });
    });
});
