import nock from "nock";

import StaticdeployClient from "../src";

const baseUrl = "http://localhost";
const staticdeployClient = new StaticdeployClient({ apiUrl: baseUrl });

beforeEach(() => {
    nock.cleanAll();
});

describe("StaticdeployClient", () => {
    describe("setApiToken", () => {
        beforeEach(() => {
            staticdeployClient.setApiToken(null);
        });
        it("sets the API token to be sent in the Authorization header", async () => {
            const apiToken = "apiToken";
            const reqheaders = { Authorization: `Bearer ${apiToken}` };
            const scope = nock(baseUrl, { reqheaders })
                .post("/deploy", {
                    appName: "appName",
                    entrypointUrlMatcher: "entrypointUrlMatcher",
                    bundleNameTagCombination: "bundleNameTagCombination"
                })
                .reply(204);
            staticdeployClient.setApiToken(apiToken);
            await staticdeployClient.deploy({
                appName: "appName",
                entrypointUrlMatcher: "entrypointUrlMatcher",
                bundleNameTagCombination: "bundleNameTagCombination"
            });
            scope.done();
        });
    });

    describe("deploy", () => {
        it("requests POST /deploy", async () => {
            const scope = nock(baseUrl)
                .post("/deploy", {
                    appName: "appName",
                    entrypointUrlMatcher: "entrypointUrlMatcher",
                    bundleNameTagCombination: "bundleNameTagCombination"
                })
                .reply(204);
            await staticdeployClient.deploy({
                appName: "appName",
                entrypointUrlMatcher: "entrypointUrlMatcher",
                bundleNameTagCombination: "bundleNameTagCombination"
            });
            scope.done();
        });
    });
});
