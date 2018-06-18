import { expect } from "chai";

import isCanonicalPath from "common/isCanonicalPath";

describe("common isCanonicalPath", () => {
    describe("returns that a requested path is canonical for a matching asset when", () => {
        it("the matching asset is the fallback asset", () => {
            expect(
                isCanonicalPath(
                    "/path/",
                    { path: "/fallback", mimeType: "mimeType" },
                    { path: "/fallback", mimeType: "mimeType" }
                )
            ).to.equal(true);
        });
        describe("the requested path perfectly matches the matching asset", () => {
            it("case: path without trailing /", () => {
                expect(
                    isCanonicalPath(
                        "/path",
                        { path: "/path", mimeType: "mimeType" },
                        { path: "/fallback", mimeType: "mimeType" }
                    )
                ).to.equal(true);
            });
            it("case: path with trailing /", () => {
                expect(
                    isCanonicalPath(
                        "/path/",
                        { path: "/path", mimeType: "mimeType" },
                        { path: "/fallback", mimeType: "mimeType" }
                    )
                ).to.equal(true);
            });
        });
        describe("the requested path dot-html matches the matching asset", () => {
            it("case: path without trailing /", () => {
                expect(
                    isCanonicalPath(
                        "/path",
                        { path: "/path.html", mimeType: "mimeType" },
                        { path: "/fallback", mimeType: "mimeType" }
                    )
                ).to.equal(true);
            });
            it("case: path with trailing /", () => {
                expect(
                    isCanonicalPath(
                        "/path/",
                        { path: "/path.html", mimeType: "mimeType" },
                        { path: "/fallback", mimeType: "mimeType" }
                    )
                ).to.equal(true);
            });
        });
        describe("the requested path index-dot-html matches the matching asset", () => {
            it("case: path without trailing /", () => {
                expect(
                    isCanonicalPath(
                        "/path",
                        { path: "/path/index.html", mimeType: "mimeType" },
                        { path: "/fallback", mimeType: "mimeType" }
                    )
                ).to.equal(true);
            });
            it("case: path with trailing /", () => {
                expect(
                    isCanonicalPath(
                        "/path/",
                        { path: "/path/index.html", mimeType: "mimeType" },
                        { path: "/fallback", mimeType: "mimeType" }
                    )
                ).to.equal(true);
            });
        });
    });
});
