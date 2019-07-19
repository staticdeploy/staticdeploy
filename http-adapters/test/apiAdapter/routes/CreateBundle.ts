import { expect } from "chai";
import sinon from "sinon";
import request from "supertest";

import { getApiAdapterServer } from "../../testUtils";

describe("apiAdapter POST /bundles", () => {
    it("400 on invalid request body", () => {
        const server = getApiAdapterServer({});
        return request(server)
            .post("/bundles")
            .send({})
            .expect(400)
            .expect(/Validation failed/);
    });

    it("201 on bundle created, creates and returns the bundle", async () => {
        const execMock = sinon.stub().resolves({ name: "name", tag: "tag" });
        const server = getApiAdapterServer({ createBundle: execMock });
        await request(server)
            .post("/bundles")
            .send({
                name: "name",
                tag: "tag",
                description: "description",
                content: Buffer.from("content").toString("base64"),
                fallbackAssetPath: "/fallbackAssetPath",
                fallbackStatusCode: 404,
                headers: {}
            })
            .expect(201)
            .expect({ name: "name", tag: "tag" });
        expect(execMock).to.have.been.calledOnceWith({
            name: "name",
            tag: "tag",
            description: "description",
            content: Buffer.from("content"),
            fallbackAssetPath: "/fallbackAssetPath",
            fallbackStatusCode: 404,
            headers: {}
        });
    });
});
