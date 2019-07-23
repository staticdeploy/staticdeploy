import { expect } from "chai";

import isCanonicalPath from "../../../src/usecases/RespondToEndpointRequest/isCanonicalPath";

describe("RespondToEndpointRequest.isCanonicalPath", () => {
    const baseAsset = { mimeType: "mimeType", headers: {} };

    describe("returns that a requested path is canonical for a matching asset when", () => {
        it("the matching asset is the fallback asset", () => {
            expect(
                isCanonicalPath(
                    "/path/",
                    { path: "/fallback", ...baseAsset },
                    { path: "/fallback", ...baseAsset }
                )
            ).to.equal(true);
        });

        describe("the requested path perfectly matches the matching asset", () => {
            it("case: path without trailing /", () => {
                expect(
                    isCanonicalPath(
                        "/path",
                        { path: "/path", ...baseAsset },
                        { path: "/fallback", ...baseAsset }
                    )
                ).to.equal(true);
            });

            it("case: path with trailing /", () => {
                expect(
                    isCanonicalPath(
                        "/path/",
                        { path: "/path", ...baseAsset },
                        { path: "/fallback", ...baseAsset }
                    )
                ).to.equal(true);
            });
        });

        describe("the requested path dot-html matches the matching asset", () => {
            it("case: path without trailing /", () => {
                expect(
                    isCanonicalPath(
                        "/path",
                        { path: "/path.html", ...baseAsset },
                        { path: "/fallback", ...baseAsset }
                    )
                ).to.equal(true);
            });

            it("case: path with trailing /", () => {
                expect(
                    isCanonicalPath(
                        "/path/",
                        { path: "/path.html", ...baseAsset },
                        { path: "/fallback", ...baseAsset }
                    )
                ).to.equal(true);
            });
        });

        describe("the requested path index-dot-html matches the matching asset", () => {
            it("case: path without trailing /", () => {
                expect(
                    isCanonicalPath(
                        "/path",
                        { path: "/path/index.html", ...baseAsset },
                        { path: "/fallback", ...baseAsset }
                    )
                ).to.equal(true);
            });

            it("case: path with trailing /", () => {
                expect(
                    isCanonicalPath(
                        "/path/",
                        { path: "/path/index.html", ...baseAsset },
                        { path: "/fallback", ...baseAsset }
                    )
                ).to.equal(true);
            });
        });
    });
});
