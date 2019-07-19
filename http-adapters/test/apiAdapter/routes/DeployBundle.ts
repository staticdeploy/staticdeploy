import { expect } from "chai";
import sinon from "sinon";
import request from "supertest";

import { getApiAdapterServer } from "../../testUtils";

describe("apiAdapter POST /deploy", () => {
    it("400 on invalid request body", () => {
        const server = getApiAdapterServer({});
        return request(server)
            .post("/deploy")
            .send({})
            .expect(400)
            .expect(/Validation failed/);
    });

    it("204 on bundle deployed, deploys the bundle", async () => {
        const execMock = sinon.stub().resolves();
        const server = getApiAdapterServer({ deployBundle: execMock });
        await request(server)
            .post("/deploy")
            .send({
                appName: "appName",
                entrypointUrlMatcher: "entrypointUrlMatcher",
                bundleNameTagCombination: "bundleNameTagCombination"
            })
            .expect(204);
        expect(execMock).to.have.been.calledOnceWith({
            appName: "appName",
            entrypointUrlMatcher: "entrypointUrlMatcher",
            bundleNameTagCombination: "bundleNameTagCombination"
        });
    });
});
