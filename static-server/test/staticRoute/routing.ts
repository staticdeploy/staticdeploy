import { escape } from "lodash";

import { test } from "../setup";

function htmlWith(body: string): string {
    return `<html><head></head><body>${escape(body)}</body></html>`;
}

describe("staticRoute routing", () => {
    /*
    *   404-s
    */
    test("404 when no matching entrypoint is found", {
        entrypoints: [],
        testCases: [
            {
                requestedUrl: "domain.com/asset",
                expectedStatusCode: 404,
                expectedBody: "No entrypoint found matching url domain.com/asset"
            }
        ]
    });

    test("404 when the matching entrypoint has no linked deployment", {
        entrypoints: [{ urlMatcher: "domain.com/" }],
        testCases: [
            {
                requestedUrl: "domain.com/asset",
                expectedStatusCode: 404,
                expectedBody: "No active deployment found for entrypoint domain.com/"
            }
        ]
    });
    test("404 when the fallback resource is not found", {
        entrypoints: [
            {
                urlMatcher: "domain.com/",
                deploymentContent: {}
            }
        ],
        testCases: [
            {
                requestedUrl: "domain.com/asset",
                expectedStatusCode: 404,
                expectedBody: "No asset found at /index.html"
            }
        ]
    });

    /*
    *   301-s
    */
    test("redirects to trailing slash when urlMatcher without trailing slash is requested", {
        entrypoints: [
            {
                urlMatcher: "domain.com/",
                deploymentContent: {
                    path: "domain.com/ + /path",
                    pathAsset: "domain.com/ + /pathAsset"
                }
            },
            {
                urlMatcher: "domain.com/path/",
                deploymentContent: {
                    subpath: "domain.com/path/ + /subpath",
                    subpathAsset: "domain.com/path/ + /subpathAsset"
                }
            },
            {
                urlMatcher: "domain.com/path/subpath/",
                deploymentContent: {}
            }
        ],
        testCases: [
            {
                requestedUrl: "domain.com/path",
                expectedStatusCode: 301,
                expectedLocation: "/path/"
            },
            {
                requestedUrl: "domain.com/path/subpath",
                expectedStatusCode: 301,
                expectedLocation: "/path/subpath/"
            },
            {
                requestedUrl: "domain.com/pathAsset",
                expectedStatusCode: 200,
                expectedBody: "domain.com/ + /pathAsset"
            },
            {
                requestedUrl: "domain.com/path/subpathAsset",
                expectedStatusCode: 200,
                expectedBody: "domain.com/path/ + /subpathAsset"
            }
        ]
    });
    test("redirects to the canonical path", {
        entrypoints: [
            {
                urlMatcher: "domain.com/",
                deploymentContent: {
                    asset: "domain.com/ + /asset",
                    nested: { asset: "domain.com/ + /nested/asset" }
                }
            },
            {
                urlMatcher: "domain.com/path/",
                deploymentContent: {
                    asset: "domain.com/path/ + /asset",
                    nested: { asset: "domain.com/path/ + /nested/asset" }
                }
            }
        ],
        testCases: [
            // domain.com/ cases
            {
                requestedUrl: "domain.com/prefix/asset",
                expectedStatusCode: 301,
                expectedLocation: "/asset"
            },
            {
                requestedUrl: "domain.com/prefix/nested/asset",
                expectedStatusCode: 301,
                expectedLocation: "/nested/asset"
            },
            {
                requestedUrl: "domain.com/nested/prefix/asset",
                expectedStatusCode: 301,
                expectedLocation: "/asset"
            },
            {
                requestedUrl: "domain.com/nested/prefix/nested/asset",
                expectedStatusCode: 301,
                expectedLocation: "/nested/asset"
            },
            // domain.com/path/ cases
            {
                requestedUrl: "domain.com/path/prefix/asset",
                expectedStatusCode: 301,
                expectedLocation: "/path/asset"
            },
            {
                requestedUrl: "domain.com/path/prefix/nested/asset",
                expectedStatusCode: 301,
                expectedLocation: "/path/nested/asset"
            },
            {
                requestedUrl: "domain.com/path/nested/prefix/asset",
                expectedStatusCode: 301,
                expectedLocation: "/path/asset"
            },
            {
                requestedUrl: "domain.com/path/nested/prefix/nested/asset",
                expectedStatusCode: 301,
                expectedLocation: "/path/nested/asset"
            }
        ]
    });

    /*
    *   200-s
    */
    test("gives precedence to longer-matching entrypoints", {
        entrypoints: [
            {
                urlMatcher: "domain.com/",
                deploymentContent: {
                    path: { asset: "domain.com/ + /path/asset" }
                }
            },
            {
                urlMatcher: "domain.com/path/",
                deploymentContent: {
                    asset: "domain.com/path/ + /asset",
                    subpath: { asset: "domain.com/path/ + /subpath/asset" }
                }
            },
            {
                urlMatcher: "domain.com/path/subpath/",
                deploymentContent: {
                    asset: "domain.com/path/subpath/ + /asset"
                }
            }
        ],
        testCases: [
            {
                requestedUrl: "domain.com/path/asset",
                expectedStatusCode: 200,
                expectedBody: "domain.com/path/ + /asset"
            },
            {
                requestedUrl: "domain.com/path/subpath/asset",
                expectedStatusCode: 200,
                expectedBody: "domain.com/path/subpath/ + /asset"
            }
        ]
    });

    test("serves the correct asset when requested by canonical path", {
        entrypoints: [
            {
                urlMatcher: "domain.com/",
                deploymentContent: {
                    asset: "domain.com/ + /asset",
                    nested: { asset: "domain.com/ + /nested/asset" }
                }
            }
        ],
        testCases: [
            {
                requestedUrl: "domain.com/asset",
                expectedStatusCode: 200,
                expectedBody: "domain.com/ + /asset"
            },
            {
                requestedUrl: "domain.com/nested/asset",
                expectedStatusCode: 200,
                expectedBody: "domain.com/ + /nested/asset"
            }
        ]
    });

    test("serves the .html file even when .html is omitted in the url", {
        entrypoints: [
            {
                urlMatcher: "domain.com/",
                deploymentContent: {
                    "index.html": htmlWith("domain.com/ + /index.html"),
                    "a.html": htmlWith("domain.com/ + /a.html"),
                    "asset.html": htmlWith("domain.com/ + /asset.html"),
                    nested: {
                        "index.html": htmlWith("domain.com/ + /nested/index.html"),
                        "a.html": htmlWith("domain.com/ + /nested/a.html"),
                        "asset.html": htmlWith("domain.com/ + /nested/asset.html")
                    }
                }
            }
        ],
        testCases: [
            {
                requestedUrl: "domain.com/a",
                expectedStatusCode: 200,
                expectedBody: htmlWith("domain.com/ + /a.html")
            },
            {
                requestedUrl: "domain.com/asset",
                expectedStatusCode: 200,
                expectedBody: htmlWith("domain.com/ + /asset.html")
            },
            {
                requestedUrl: "domain.com/nested/a",
                expectedStatusCode: 200,
                expectedBody: htmlWith("domain.com/ + /nested/a.html")
            },
            {
                requestedUrl: "domain.com/nested/asset",
                expectedStatusCode: 200,
                expectedBody: htmlWith("domain.com/ + /nested/asset.html")
            }
        ]
    });

    test("serves the .html file even when .html is omitted and the url has a trailing slash", {
        entrypoints: [
            {
                urlMatcher: "domain.com/",
                deploymentContent: {
                    "asset.html": htmlWith("domain.com/ + /asset.html"),
                    nested: { "asset.html": htmlWith("domain.com/ + /nested/asset.html") }
                }
            }
        ],
        testCases: [
            {
                requestedUrl: "domain.com/asset/",
                expectedStatusCode: 200,
                expectedBody: htmlWith("domain.com/ + /asset.html")
            },
            {
                requestedUrl: "domain.com/nested/asset/",
                expectedStatusCode: 200,
                expectedBody: htmlWith("domain.com/ + /nested/asset.html")
            }
        ]
    });

    test("serves requestedPath + /index.html when that file exists", {
        entrypoints: [
            {
                urlMatcher: "domain.com/",
                deploymentContent: {
                    "index.html": htmlWith("domain.com/ + /index.html"),
                    nested: { "index.html": htmlWith("domain.com/ + /nested/index.html") }
                }
            }
        ],
        testCases: [
            {
                requestedUrl: "domain.com/",
                expectedStatusCode: 200,
                expectedBody: htmlWith("domain.com/ + /index.html")
            },
            {
                requestedUrl: "domain.com/nested",
                expectedStatusCode: 200,
                expectedBody: htmlWith("domain.com/ + /nested/index.html")
            },
            {
                requestedUrl: "domain.com/nested/",
                expectedStatusCode: 200,
                expectedBody: htmlWith("domain.com/ + /nested/index.html")
            }
        ]
    });

    test("when files requestedPath and requestedPath + /index.html exist, serves the second", {
        entrypoints: [
            {
                urlMatcher: "domain.com/",
                deploymentContent: {
                    "nested.html": htmlWith("domain.com/ + /nested.html"),
                    nested: { "index.html": htmlWith("domain.com/ + /nested/index.html") },
                    "n.html": htmlWith("domain.com/ + /n.html"),
                    n: { "index.html": htmlWith("domain.com/ + /n/index.html") }
                }
            }
        ],
        testCases: [
            {
                requestedUrl: "domain.com/nested",
                expectedStatusCode: 200,
                expectedBody: htmlWith("domain.com/ + /nested/index.html")
            },
            {
                requestedUrl: "domain.com/nested/",
                expectedStatusCode: 200,
                expectedBody: htmlWith("domain.com/ + /nested/index.html")
            },
            {
                // The file "/nested.html/index.html" does not exist, hence we
                // expect /nested.html to be served
                requestedUrl: "domain.com/nested.html",
                expectedStatusCode: 200,
                expectedBody: htmlWith("domain.com/ + /nested.html")
            },
            {
                requestedUrl: "domain.com/n",
                expectedStatusCode: 200,
                expectedBody: htmlWith("domain.com/ + /n/index.html")
            },
            {
                requestedUrl: "domain.com/n/",
                expectedStatusCode: 200,
                expectedBody: htmlWith("domain.com/ + /n/index.html")
            },
            {
                // The file "/n.html/index.html" does not exist, hence we
                // expect /n.html to be served
                requestedUrl: "domain.com/n.html",
                expectedStatusCode: 200,
                expectedBody: htmlWith("domain.com/ + /n.html")
            }
        ]
    });

    test("serves the fallback resource when no asset matches", {
        entrypoints: [
            {
                urlMatcher: "domain.com/",
                deploymentContent: {
                    "index.html": htmlWith("domain.com/ + /index.html")
                }
            }
        ],
        testCases: [
            {
                requestedUrl: "domain.com/non-existing",
                expectedStatusCode: 200,
                expectedBody: htmlWith("domain.com/ + /index.html")
            }
        ]
    });
});
