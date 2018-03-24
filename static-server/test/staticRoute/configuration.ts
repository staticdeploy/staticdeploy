import { expect } from "chai";
import { load } from "cheerio";
import { VM } from "vm2";

import { test } from "../setup";

const htmlWithConfig = '<head><script id="app-config"></script></head>';

function getInjectedAPP_CONFIG(body: string) {
    const $ = load(body);
    const scriptContent = $("script#app-config").html();
    const vm = new VM({ sandbox: { window: {} } });
    vm.run(scriptContent!);
    return vm.run("window.APP_CONFIG");
}

describe("staticRoute configuration injection", () => {
    test("doesn't inject anything in non-html files", {
        entrypoints: [
            {
                urlMatcher: "domain.com/",
                bundleContent: {
                    asset: htmlWithConfig
                }
            }
        ],
        testCases: [
            {
                requestedUrl: "domain.com/asset",
                expectedStatusCode: 200,
                expectedBody: htmlWithConfig
            }
        ]
    });

    test("if the entrypoint has no configuration, injects the linked app's default configuration", {
        entrypoints: [
            {
                urlMatcher: "domain.com/",
                defaultConfiguration: { KEY: "DEFAULT_VALUE" },
                bundleContent: {
                    "asset.html": htmlWithConfig
                }
            }
        ],
        testCases: [
            {
                requestedUrl: "domain.com/asset.html",
                expectedStatusCode: 200,
                expectedBody: body => {
                    const APP_CONFIG = getInjectedAPP_CONFIG(body);
                    expect(APP_CONFIG).to.deep.equal({
                        KEY: "DEFAULT_VALUE"
                    });
                }
            }
        ]
    });

    test("injects the entrypoint's configuration", {
        entrypoints: [
            {
                urlMatcher: "domain.com/",
                configuration: { KEY: "VALUE" },
                defaultConfiguration: { KEY: "DEFAULT_VALUE" },
                bundleContent: {
                    "asset.html": htmlWithConfig,
                    nested: {
                        "index.html": htmlWithConfig
                    }
                }
            }
        ],
        testCases: [
            {
                requestedUrl: "domain.com/asset.html",
                expectedStatusCode: 200,
                expectedBody: body => {
                    const APP_CONFIG = getInjectedAPP_CONFIG(body);
                    expect(APP_CONFIG).to.deep.equal({
                        KEY: "VALUE"
                    });
                }
            },
            {
                requestedUrl: "domain.com/nested",
                expectedStatusCode: 200,
                expectedBody: body => {
                    const APP_CONFIG = getInjectedAPP_CONFIG(body);
                    expect(APP_CONFIG).to.deep.equal({
                        KEY: "VALUE"
                    });
                }
            }
        ]
    });
});
