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
                        expect(APP_CONFIG).to.have.property(
                            "KEY",
                            "DEFAULT_VALUE"
                        );
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
                    expect(APP_CONFIG).to.have.property("KEY", "VALUE");
                }
            },
            {
                requestedUrl: "domain.com/nested",
                expectedStatusCode: 200,
                expectedBody: body => {
                    const APP_CONFIG = extractAppConfig(body);
                    expect(APP_CONFIG).to.have.property("KEY", "VALUE");
                }
            }
        ]
    });

    test(
        "injects the entrypoint's urlMatcher's pathname as the BASE_PATH configuration option",
        {
            entrypoints: [
                {
                    urlMatcher: "domain.com/",
                    bundleContent: {
                        "index.html": htmlWithConfig
                    },
                    bundleFallbackAssetPath: "/index.html"
                },
                {
                    urlMatcher: "domain.com/path/",
                    bundleContent: {
                        "index.html": htmlWithConfig
                    },
                    bundleFallbackAssetPath: "/index.html"
                }
            ],
            testCases: [
                {
                    requestedUrl: "domain.com/",
                    expectedStatusCode: 200,
                    expectedBody: body => {
                        const APP_CONFIG = extractAppConfig(body);
                        expect(APP_CONFIG).to.have.property("BASE_PATH", "/");
                    }
                },
                {
                    requestedUrl: "domain.com/nested",
                    expectedStatusCode: 200,
                    expectedBody: body => {
                        const APP_CONFIG = extractAppConfig(body);
                        expect(APP_CONFIG).to.have.property("BASE_PATH", "/");
                    }
                },
                {
                    requestedUrl: "domain.com/path/",
                    expectedStatusCode: 200,
                    expectedBody: body => {
                        const APP_CONFIG = extractAppConfig(body);
                        expect(APP_CONFIG).to.have.property(
                            "BASE_PATH",
                            "/path/"
                        );
                    }
                },
                {
                    requestedUrl: "domain.com/path/nested",
                    expectedStatusCode: 200,
                    expectedBody: body => {
                        const APP_CONFIG = extractAppConfig(body);
                        expect(APP_CONFIG).to.have.property(
                            "BASE_PATH",
                            "/path/"
                        );
                    }
                }
            ]
        }
    );

    test(
        "when a CSP header is defined, modifies it to whitelist the injected configuration script",
        {
            entrypoints: [
                {
                    urlMatcher: "csp.com/simple/",
                    configuration: { KEY: "VALUE" },
                    bundleContent: {
                        "index.html": htmlWithConfig
                    },
                    bundleHeaders: {
                        "/index.html": {
                            "content-security-policy": "default-src 'self'"
                        }
                    },
                    bundleFallbackAssetPath: "/index.html"
                },
                {
                    urlMatcher: "csp.com/complex/",
                    configuration: { KEY: "VALUE" },
                    bundleContent: {
                        "index.html": htmlWithConfig
                    },
                    bundleHeaders: {
                        "/index.html": {
                            "content-security-policy":
                                "default-src 'self'; script-src 'sha256-aaa'"
                        }
                    },
                    bundleFallbackAssetPath: "/index.html"
                },
                {
                    urlMatcher: "no-csp.com/",
                    configuration: { KEY: "VALUE" },
                    bundleContent: {
                        "index.html": htmlWithConfig
                    },
                    bundleFallbackAssetPath: "/index.html"
                }
            ],
            testCases: [
                {
                    requestedUrl: "csp.com/simple/",
                    expectedStatusCode: 200,
                    expectedHeaders: {
                        "content-type": "text/html",
                        "content-security-policy":
                            "default-src 'self'; script-src 'sha256-lU2WXEPqWduFTew3wM9rTvhhDENamUsesYK0WO0AYJY='"
                    }
                },
                {
                    requestedUrl: "csp.com/complex/",
                    expectedStatusCode: 200,
                    expectedHeaders: {
                        "content-type": "text/html",
                        "content-security-policy":
                            "default-src 'self'; script-src 'sha256-aaa' 'sha256-8D20jdHeeIMyl5CzK1k7/JR35VYjJ8FGMuswHptw7no='"
                    }
                },
                // Also test that the header is not added if not already present
                {
                    requestedUrl: "no-csp.com/",
                    expectedStatusCode: 200,
                    expectedHeaders: headers => {
                        expect(headers).not.to.have.property(
                            "content-security-policy"
                        );
                    }
                }
            ]
        }
    );
});
