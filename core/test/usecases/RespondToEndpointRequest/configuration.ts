import { expect } from "chai";

import { extractAppConfig, test } from "./testUtils";

const htmlWithConfig = '<head><script id="app-config"></script></head>';

describe("usecase RespondToEndpointRequest (configuration)", () => {
    test("doesn't inject anything in non-html files", {
        entrypoints: [
            {
                urlMatcher: "domain.com/",
                bundleContent: {
                    asset: htmlWithConfig,
                    fallback: "fallback"
                },
                bundleFallbackAssetPath: "/fallback"
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

    test(
        "if the entrypoint has no configuration, injects the linked app's default configuration",
        {
            entrypoints: [
                {
                    urlMatcher: "domain.com/",
                    defaultConfiguration: { KEY: "DEFAULT_VALUE" },
                    bundleContent: {
                        "asset.html": htmlWithConfig,
                        fallback: "fallback"
                    },
                    bundleFallbackAssetPath: "/fallback"
                }
            ],
            testCases: [
                {
                    requestedUrl: "domain.com/asset.html",
                    expectedStatusCode: 200,
                    expectedBody: body => {
                        const APP_CONFIG = extractAppConfig(body);
                        expect(APP_CONFIG).to.deep.equal({
                            KEY: "DEFAULT_VALUE"
                        });
                    }
                }
            ]
        }
    );

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
                    },
                    fallback: "fallback"
                },
                bundleFallbackAssetPath: "/fallback"
            }
        ],
        testCases: [
            {
                requestedUrl: "domain.com/asset.html",
                expectedStatusCode: 200,
                expectedBody: body => {
                    const APP_CONFIG = extractAppConfig(body);
                    expect(APP_CONFIG).to.deep.equal({
                        KEY: "VALUE"
                    });
                }
            },
            {
                requestedUrl: "domain.com/nested",
                expectedStatusCode: 200,
                expectedBody: body => {
                    const APP_CONFIG = extractAppConfig(body);
                    expect(APP_CONFIG).to.deep.equal({
                        KEY: "VALUE"
                    });
                }
            }
        ]
    });
});
