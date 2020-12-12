import {
    NoBundleOrRedirectToError,
    NoMatchingEntrypointError,
} from "../../../src/common/errors";
import { htmlWith, test } from "./testUtils";

describe("usecase RespondToEndpointRequest (routing)", () => {
    /*
     *  NoMatchingEntrypointError
     */
    test("NoMatchingEntrypointError when no matching entrypoint is found", {
        entrypoints: [],
        testCases: [
            {
                requestedUrl: "domain.com/asset",
                expectedError: NoMatchingEntrypointError,
            },
        ],
    });

    /*
     *  NoBundleOrRedirectToError
     */
    test(
        "NoBundleOrRedirectToError when the matching entrypoint has no linked bundle and no configured redirect",
        {
            entrypoints: [{ urlMatcher: "domain.com/" }],
            testCases: [
                {
                    requestedUrl: "domain.com/asset",
                    expectedError: NoBundleOrRedirectToError,
                },
            ],
        }
    );

    /*
     *  301 responses
     */
    test(
        "PermanentRedirect to trailing slash when urlMatcher without trailing slash is requested",
        {
            entrypoints: [
                {
                    urlMatcher: "domain.com/",
                    bundleContent: {
                        path: "domain.com/ + /path",
                        pathAsset: "domain.com/ + /pathAsset",
                        fallback: "domain.com + /fallback",
                    },
                    bundleFallbackAssetPath: "/fallback",
                },
                {
                    urlMatcher: "domain.com/path/",
                    bundleContent: {
                        subpath: "domain.com/path/ + /subpath",
                        subpathAsset: "domain.com/path/ + /subpathAsset",
                        fallback: "domain.com/path/ + /fallback",
                    },
                    bundleFallbackAssetPath: "/fallback",
                },
                {
                    urlMatcher: "domain.com/path/subpath/",
                    bundleContent: {
                        fallback: "domain.com/path/subpath/ + /fallback",
                    },
                    bundleFallbackAssetPath: "/fallback",
                },
            ],
            testCases: [
                // Cases where redirection is needed
                {
                    requestedUrl: "domain.com/path",
                    expectedStatusCode: 301,
                    expectedLocationHeader: "/path/",
                },
                {
                    requestedUrl: "domain.com/path/subpath",
                    expectedStatusCode: 301,
                    expectedLocationHeader: "/path/subpath/",
                },
                // Cases where redirection is not needed
                {
                    requestedUrl: "domain.com/pathAsset",
                    expectedStatusCode: 200,
                    expectedBody: "domain.com/ + /pathAsset",
                },
                {
                    requestedUrl: "domain.com/path/subpathAsset",
                    expectedStatusCode: 200,
                    expectedBody: "domain.com/path/ + /subpathAsset",
                },
            ],
        }
    );

    test("PermanentRedirect to the canonical path", {
        entrypoints: [
            {
                urlMatcher: "domain.com/",
                bundleContent: {
                    asset: "domain.com/ + /asset",
                    nested: {
                        asset: "domain.com/ + /nested/asset",
                        "index.html": "domain.com/ + /nested/index.html",
                    },
                    fallback: "domain.com/ + /fallback",
                },
                bundleFallbackAssetPath: "/fallback",
            },
            {
                urlMatcher: "domain.com/path/",
                bundleContent: {
                    asset: "domain.com/path/ + /asset",
                    nested: { asset: "domain.com/path/ + /nested/asset" },
                    fallback: "domain.com/path/ + /fallback",
                },
                bundleFallbackAssetPath: "/fallback",
            },
        ],
        testCases: [
            // domain.com/ cases
            {
                requestedUrl: "domain.com/prefix/asset",
                expectedStatusCode: 301,
                expectedLocationHeader: "/asset",
            },
            {
                requestedUrl: "domain.com/prefix/nested/asset",
                expectedStatusCode: 301,
                expectedLocationHeader: "/nested/asset",
            },
            {
                requestedUrl: "domain.com/nested/prefix/asset",
                expectedStatusCode: 301,
                expectedLocationHeader: "/asset",
            },
            {
                requestedUrl: "domain.com/nested/prefix/nested/asset",
                expectedStatusCode: 301,
                expectedLocationHeader: "/nested/asset",
            },
            // domain.com/path/ cases
            {
                requestedUrl: "domain.com/path/prefix/asset",
                expectedStatusCode: 301,
                expectedLocationHeader: "/path/asset",
            },
            {
                requestedUrl: "domain.com/path/prefix/nested/asset",
                expectedStatusCode: 301,
                expectedLocationHeader: "/path/nested/asset",
            },
            {
                requestedUrl: "domain.com/path/nested/prefix/asset",
                expectedStatusCode: 301,
                expectedLocationHeader: "/path/asset",
            },
            {
                requestedUrl: "domain.com/path/nested/prefix/nested/asset",
                expectedStatusCode: 301,
                expectedLocationHeader: "/path/nested/asset",
            },
        ],
    });

    /*
     *  302 responses
     */
    test("TemporaryRedirect to the entrypoint's redirectTo when specified", {
        entrypoints: [
            {
                urlMatcher: "domain.com/",
                redirectTo: "https://redirect.location",
            },
        ],
        testCases: [
            {
                requestedUrl: "domain.com/",
                expectedStatusCode: 302,
                expectedLocationHeader: "https://redirect.location",
            },
        ],
    });

    /*
     *  200 and fallback responses
     */
    test("gives precedence to longer-matching entrypoints", {
        entrypoints: [
            {
                urlMatcher: "domain.com/",
                bundleContent: {
                    path: { asset: "domain.com/ + /path/asset" },
                    fallback: "domain.com/ + fallback",
                },
                bundleFallbackAssetPath: "/fallback",
            },
            {
                urlMatcher: "domain.com/path/",
                bundleContent: {
                    asset: "domain.com/path/ + /asset",
                    subpath: { asset: "domain.com/path/ + /subpath/asset" },
                    fallback: "domain.com/path/ + /fallback",
                },
                bundleFallbackAssetPath: "/fallback",
            },
            {
                urlMatcher: "domain.com/path/subpath/",
                bundleContent: {
                    asset: "domain.com/path/subpath/ + /asset",
                    fallback: "domain.com/path/subpath/ + /fallback",
                },
                bundleFallbackAssetPath: "/fallback",
            },
        ],
        testCases: [
            {
                requestedUrl: "domain.com/path/asset",
                expectedStatusCode: 200,
                expectedBody: "domain.com/path/ + /asset",
            },
            {
                requestedUrl: "domain.com/path/subpath/asset",
                expectedStatusCode: 200,
                expectedBody: "domain.com/path/subpath/ + /asset",
            },
        ],
    });

    test("serves the correct asset when requested by canonical path", {
        entrypoints: [
            {
                urlMatcher: "domain.com/",
                bundleContent: {
                    asset: "domain.com/ + /asset",
                    nested: { asset: "domain.com/ + /nested/asset" },
                    fallback: "domain.com/ + /fallback",
                },
                bundleFallbackAssetPath: "/fallback",
            },
        ],
        testCases: [
            {
                requestedUrl: "domain.com/asset",
                expectedStatusCode: 200,
                expectedBody: "domain.com/ + /asset",
            },
            {
                requestedUrl: "domain.com/nested/asset",
                expectedStatusCode: 200,
                expectedBody: "domain.com/ + /nested/asset",
            },
        ],
    });

    test(
        "serves the correct asset when requested with a hostname ending with dot",
        {
            entrypoints: [
                {
                    urlMatcher: "domain.com/",
                    bundleContent: {
                        asset: "domain.com/ + /asset",
                        nested: { asset: "domain.com/ + /nested/asset" },
                        fallback: "domain.com/ + /fallback",
                    },
                    bundleFallbackAssetPath: "/fallback",
                },
            ],
            testCases: [
                {
                    requestedUrl: "domain.com./asset",
                    expectedStatusCode: 200,
                    expectedBody: "domain.com/ + /asset",
                },
                {
                    requestedUrl: "domain.com./nested/asset",
                    expectedStatusCode: 200,
                    expectedBody: "domain.com/ + /nested/asset",
                },
            ],
        }
    );

    test(
        "when file requestedPath doesn't exist, but requestPath + .html exists, serves it",
        {
            entrypoints: [
                {
                    urlMatcher: "domain.com/",
                    bundleContent: {
                        "path.html": htmlWith("domain.com/ + /path.html"),
                        fallback: "domain.com/ + /fallback",
                    },
                    bundleFallbackAssetPath: "/fallback",
                },
            ],
            testCases: [
                {
                    requestedUrl: "domain.com/path",
                    expectedStatusCode: 200,
                    expectedBody: htmlWith("domain.com/ + /path.html"),
                },
                {
                    requestedUrl: "domain.com/path/",
                    expectedStatusCode: 200,
                    expectedBody: htmlWith("domain.com/ + /path.html"),
                },
            ],
        }
    );

    test(
        "when file requestedPath doesn't exist, but requestPath + /index.html exists, serves it",
        {
            entrypoints: [
                {
                    urlMatcher: "domain.com/",
                    bundleContent: {
                        "index.html": htmlWith("domain.com/ + /index.html"),
                        path: {
                            "index.html": htmlWith(
                                "domain.com/ + /path/index.html"
                            ),
                        },
                        fallback: "domain.com/ + /fallback",
                    },
                    bundleFallbackAssetPath: "/fallback",
                },
            ],
            testCases: [
                {
                    requestedUrl: "domain.com/",
                    expectedStatusCode: 200,
                    expectedBody: htmlWith("domain.com/ + /index.html"),
                },
                {
                    requestedUrl: "domain.com/path",
                    expectedStatusCode: 200,
                    expectedBody: htmlWith("domain.com/ + /path/index.html"),
                },
                {
                    requestedUrl: "domain.com/path/",
                    expectedStatusCode: 200,
                    expectedBody: htmlWith("domain.com/ + /path/index.html"),
                },
            ],
        }
    );

    test(
        "when files requestedPath and requestedPath + .html exist, serves the first",
        {
            entrypoints: [
                {
                    urlMatcher: "domain.com/",
                    bundleContent: {
                        path: "domain.com/ + /path",
                        "path.html": htmlWith("domain.com/ + /path.html"),
                        fallback: "domain.com/ + /fallback",
                    },
                    bundleFallbackAssetPath: "/fallback",
                },
            ],
            testCases: [
                {
                    requestedUrl: "domain.com/path",
                    expectedStatusCode: 200,
                    expectedBody: "domain.com/ + /path",
                },
                {
                    requestedUrl: "domain.com/path/",
                    expectedStatusCode: 200,
                    expectedBody: "domain.com/ + /path",
                },
            ],
        }
    );

    test(
        "when file requestedPath doesn't exist, but files requestedPath + .html and requestedPath + /index.html exist, serves the first",
        {
            entrypoints: [
                {
                    urlMatcher: "domain.com/",
                    bundleContent: {
                        "path.html": htmlWith("domain.com/ + /path.html"),
                        path: {
                            "index.html": htmlWith(
                                "domain.com/ + /path/index.html"
                            ),
                        },
                        fallback: "domain.com/ + /fallback",
                    },
                    bundleFallbackAssetPath: "/fallback",
                },
            ],
            testCases: [
                {
                    requestedUrl: "domain.com/path",
                    expectedStatusCode: 200,
                    expectedBody: htmlWith("domain.com/ + /path.html"),
                },
                {
                    requestedUrl: "domain.com/path/",
                    expectedStatusCode: 200,
                    expectedBody: htmlWith("domain.com/ + /path.html"),
                },
            ],
        }
    );

    test("serves the fallback asset when no asset matches", {
        entrypoints: [
            {
                urlMatcher: "domain.com/",
                bundleContent: {
                    fallback: "domain.com/ + /fallback",
                },
                bundleFallbackAssetPath: "/fallback",
            },
        ],
        testCases: [
            {
                requestedUrl: "domain.com/non-existing",
                expectedStatusCode: 200,
                expectedBody: "domain.com/ + /fallback",
            },
            {
                requestedUrl: "domain.com/prefix/non-existing",
                expectedStatusCode: 200,
                expectedBody: "domain.com/ + /fallback",
            },
        ],
    });

    test(
        "when serving fallback asset, uses the status code specified in the bundle",
        {
            entrypoints: [
                {
                    urlMatcher: "domain.com/",
                    bundleContent: {
                        path: "domain.com/ + /path",
                        fallback: "domain.com/ + /fallback",
                    },
                    bundleFallbackAssetPath: "/fallback",
                    bundleFallbackStatusCode: 299,
                },
            ],
            testCases: [
                {
                    requestedUrl: "domain.com/path",
                    expectedStatusCode: 200,
                    expectedBody: "domain.com/ + /path",
                },
                {
                    requestedUrl: "domain.com/fallback",
                    expectedStatusCode: 299,
                    expectedBody: "domain.com/ + /fallback",
                },
                {
                    requestedUrl: "domain.com/non-existing",
                    expectedStatusCode: 299,
                    expectedBody: "domain.com/ + /fallback",
                },
                {
                    requestedUrl: "domain.com/prefix/non-existing",
                    expectedStatusCode: 299,
                    expectedBody: "domain.com/ + /fallback",
                },
            ],
        }
    );

    test("adds custom asset-headers specified in the bundle to the response", {
        entrypoints: [
            {
                urlMatcher: "domain.com/",
                bundleContent: {
                    asset: "domain.com/ + /asset",
                    "asset.html": htmlWith("domain.com/ + /asset.html"),
                    "asset.js": "domain.com/ + /asset.js",
                    fallback: "domain.com/ + /fallback",
                },
                bundleFallbackAssetPath: "/fallback",
                bundleHeaders: {
                    // / (slash) and * can't be used in headers without
                    // escaping, use _ and - instead
                    "/asset": { _asset: "_asset" },
                    "**/*.html": { "--_-.html": "--_-.html" },
                },
            },
        ],
        testCases: [
            {
                requestedUrl: "domain.com/asset",
                expectedStatusCode: 200,
                expectedHeaders: {
                    _asset: "_asset",
                    "content-type": "application/octet-stream",
                },
                expectedBody: "domain.com/ + /asset",
            },
            {
                requestedUrl: "domain.com/asset.html",
                expectedStatusCode: 200,
                expectedHeaders: {
                    "--_-.html": "--_-.html",
                    "content-type": "text/html",
                },
                expectedBody: htmlWith("domain.com/ + /asset.html"),
            },
        ],
    });

    test(
        "allows overriding an asset's content-type header by specifing a custom header for it",
        {
            entrypoints: [
                {
                    urlMatcher: "domain.com/",
                    bundleContent: {
                        asset: "domain.com/ + /asset",
                        "asset.html": htmlWith("domain.com/ + /asset.html"),
                        "asset.js": "domain.com/ + /asset.js",
                        fallback: "domain.com/ + /fallback",
                    },
                    bundleFallbackAssetPath: "/fallback",
                    bundleFallbackStatusCode: 200,
                    bundleHeaders: {
                        "/asset": { "content-type": "custom" },
                        "**/*.html": { "content-type": "custom/html" },
                        "**/*.js": { "content-type": "custom/js" },
                    },
                },
            ],
            testCases: [
                {
                    requestedUrl: "domain.com/asset",
                    expectedStatusCode: 200,
                    expectedHeaders: {
                        "content-type": "custom",
                    },
                    expectedBody: "domain.com/ + /asset",
                },
                {
                    requestedUrl: "domain.com/asset.html",
                    expectedStatusCode: 200,
                    expectedHeaders: {
                        "content-type": "custom/html",
                    },
                    expectedBody: htmlWith("domain.com/ + /asset.html"),
                },
                {
                    requestedUrl: "domain.com/asset.js",
                    expectedStatusCode: 200,
                    expectedHeaders: {
                        "content-type": "custom/js",
                    },
                    expectedBody: "domain.com/ + /asset.js",
                },
            ],
        }
    );
});
