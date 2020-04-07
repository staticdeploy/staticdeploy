import nock from "nock";

import StaticdeployClient from "../src";

const baseUrl = "http://localhost";
const staticdeployClient = new StaticdeployClient({
    apiUrl: baseUrl,
    apiToken: null,
});

beforeEach(() => {
    nock.cleanAll();
});

describe("StaticdeployClient", () => {
    describe("deploy", () => {
        it("requests POST /deploy", async () => {
            const scope = nock(baseUrl)
                .post("/deploy", {
                    appName: "appName",
                    entrypointUrlMatcher: "entrypointUrlMatcher",
                    bundleNameTagCombination: "bundleNameTagCombination",
                })
                .reply(204);
            await staticdeployClient.deploy({
                appName: "appName",
                entrypointUrlMatcher: "entrypointUrlMatcher",
                bundleNameTagCombination: "bundleNameTagCombination",
            });
            scope.done();
        });
    });
});
