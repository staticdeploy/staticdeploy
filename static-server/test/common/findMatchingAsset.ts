import { expect } from "chai";

import findMatchingAsset from "common/findMatchingAsset";

describe("common findMatchingAsset", () => {
    const fallback = { path: "/fallback", mimeType: "mimeType" };
    describe("matches perfectly-matching assets", () => {
        it("case: request path without trailing /", () => {
            const assets = [{ path: "/path", mimeType: "mimeType" }];
            const matchingAsset = findMatchingAsset("/path", assets, fallback);
            expect(matchingAsset.path).to.equal("/path");
        });
        it("case: request path with trailing /", () => {
            const assets = [{ path: "/path", mimeType: "mimeType" }];
            const matchingAsset = findMatchingAsset("/path/", assets, fallback);
            expect(matchingAsset.path).to.equal("/path");
        });
        it("case: request path with prefix but no trailing /", () => {
            const assets = [{ path: "/path", mimeType: "mimeType" }];
            const matchingAsset = findMatchingAsset("/prefix/path", assets, fallback);
            expect(matchingAsset.path).to.equal("/path");
        });
        it("case: request path with prefix and trailing /", () => {
            const assets = [{ path: "/path", mimeType: "mimeType" }];
            const matchingAsset = findMatchingAsset("/prefix/path/", assets, fallback);
            expect(matchingAsset.path).to.equal("/path");
        });
    });
    describe("matches dot-html-matching assets", () => {
        it("case: request path without trailing /", () => {
            const assets = [{ path: "/path.html", mimeType: "mimeType" }];
            const matchingAsset = findMatchingAsset("/path", assets, fallback);
            expect(matchingAsset.path).to.equal("/path.html");
        });
        it("case: request path with trailing /", () => {
            const assets = [{ path: "/path.html", mimeType: "mimeType" }];
            const matchingAsset = findMatchingAsset("/path/", assets, fallback);
            expect(matchingAsset.path).to.equal("/path.html");
        });
        it("case: request path with prefix but no trailing /", () => {
            const assets = [{ path: "/path.html", mimeType: "mimeType" }];
            const matchingAsset = findMatchingAsset("/prefix/path", assets, fallback);
            expect(matchingAsset.path).to.equal("/path.html");
        });
        it("case: request path with prefix and trailing /", () => {
            const assets = [{ path: "/path.html", mimeType: "mimeType" }];
            const matchingAsset = findMatchingAsset("/prefix/path/", assets, fallback);
            expect(matchingAsset.path).to.equal("/path.html");
        });
    });
    describe("matches index-dot-html-matching assets", () => {
        it("case: request path without trailing /", () => {
            const assets = [{ path: "/path/index.html", mimeType: "mimeType" }];
            const matchingAsset = findMatchingAsset("/path", assets, fallback);
            expect(matchingAsset.path).to.equal("/path/index.html");
        });
        it("case: request path with trailing /", () => {
            const assets = [{ path: "/path/index.html", mimeType: "mimeType" }];
            const matchingAsset = findMatchingAsset("/path/", assets, fallback);
            expect(matchingAsset.path).to.equal("/path/index.html");
        });
        it("case: request path with prefix but no trailing /", () => {
            const assets = [{ path: "/path/index.html", mimeType: "mimeType" }];
            const matchingAsset = findMatchingAsset("/prefix/path", assets, fallback);
            expect(matchingAsset.path).to.equal("/path/index.html");
        });
        it("case: request path with prefix and trailing /", () => {
            const assets = [{ path: "/path/index.html", mimeType: "mimeType" }];
            const matchingAsset = findMatchingAsset("/prefix/path/", assets, fallback);
            expect(matchingAsset.path).to.equal("/path/index.html");
        });
    });
    describe("falls back to fallback for non-matching assets", () => {
        describe("case: no assets", () => {
            it("case: request path without trailing /", () => {
                const matchingAsset = findMatchingAsset("/path", [], fallback);
                expect(matchingAsset.path).to.equal(fallback.path);
            });
            it("case: request path with trailing /", () => {
                const matchingAsset = findMatchingAsset("/path/", [], fallback);
                expect(matchingAsset.path).to.equal(fallback.path);
            });
            it("case: request path with prefix but no trailing /", () => {
                const matchingAsset = findMatchingAsset("/prefix/path", [], fallback);
                expect(matchingAsset.path).to.equal(fallback.path);
            });
            it("case: request path with prefix and trailing /", () => {
                const matchingAsset = findMatchingAsset("/prefix/path/", [], fallback);
                expect(matchingAsset.path).to.equal(fallback.path);
            });
        });
        describe("case: existing /.html asset", () => {
            it("case: request path without trailing /", () => {
                const assets = [{ path: "/.html", mimeType: "mimeType" }];
                const matchingAsset = findMatchingAsset("/path", assets, fallback);
                expect(matchingAsset.path).to.equal(fallback.path);
            });
            it("case: request path with trailing /", () => {
                const assets = [{ path: "/.html", mimeType: "mimeType" }];
                const matchingAsset = findMatchingAsset("/path/", assets, fallback);
                expect(matchingAsset.path).to.equal(fallback.path);
            });
            it("case: request path with prefix but no trailing /", () => {
                const assets = [{ path: "/.html", mimeType: "mimeType" }];
                const matchingAsset = findMatchingAsset("/prefix/path", assets, fallback);
                expect(matchingAsset.path).to.equal(fallback.path);
            });
            it("case: request path with prefix and trailing /", () => {
                const assets = [{ path: "/.html", mimeType: "mimeType" }];
                const matchingAsset = findMatchingAsset("/prefix/path/", assets, fallback);
                expect(matchingAsset.path).to.equal(fallback.path);
            });
        });
        describe("case: existing /index.html asset", () => {
            it("case: request path without trailing /", () => {
                const assets = [{ path: "/index.html", mimeType: "mimeType" }];
                const matchingAsset = findMatchingAsset("/path", assets, fallback);
                expect(matchingAsset.path).to.equal(fallback.path);
            });
            it("case: request path with trailing /", () => {
                const assets = [{ path: "/index.html", mimeType: "mimeType" }];
                const matchingAsset = findMatchingAsset("/path/", assets, fallback);
                expect(matchingAsset.path).to.equal(fallback.path);
            });
            it("case: request path with prefix but no trailing /", () => {
                const assets = [{ path: "/index.html", mimeType: "mimeType" }];
                const matchingAsset = findMatchingAsset("/prefix/path", assets, fallback);
                expect(matchingAsset.path).to.equal(fallback.path);
            });
            it("case: request path with prefix and trailing /", () => {
                const assets = [{ path: "/index.html", mimeType: "mimeType" }];
                const matchingAsset = findMatchingAsset("/prefix/path/", assets, fallback);
                expect(matchingAsset.path).to.equal(fallback.path);
            });
        });
    });
    describe("prioritizes perfect matches over dot-html matches", () => {
        it("case: request path without trailing /", () => {
            const assets = [{ path: "/path", mimeType: "mimeType" }, { path: "/path.html", mimeType: "mimeType" }];
            const matchingAsset = findMatchingAsset("/path", assets, fallback);
            expect(matchingAsset.path).to.equal("/path");
        });
        it("case: request path with trailing /", () => {
            const assets = [{ path: "/path", mimeType: "mimeType" }, { path: "/path.html", mimeType: "mimeType" }];
            const matchingAsset = findMatchingAsset("/path/", assets, fallback);
            expect(matchingAsset.path).to.equal("/path");
        });
        it("case: request path with prefix but no trailing /", () => {
            const assets = [{ path: "/path", mimeType: "mimeType" }, { path: "/path.html", mimeType: "mimeType" }];
            const matchingAsset = findMatchingAsset("/prefix/path", assets, fallback);
            expect(matchingAsset.path).to.equal("/path");
        });
        it("case: request path with prefix and trailing /", () => {
            const assets = [{ path: "/path", mimeType: "mimeType" }, { path: "/path.html", mimeType: "mimeType" }];
            const matchingAsset = findMatchingAsset("/prefix/path/", assets, fallback);
            expect(matchingAsset.path).to.equal("/path");
        });
    });
    describe("prioritizes perfect matches over index-dot-html matches", () => {
        it("case: request path without trailing /", () => {
            const assets = [
                { path: "/path", mimeType: "mimeType" },
                { path: "/path/index.html", mimeType: "mimeType" }
            ];
            const matchingAsset = findMatchingAsset("/path", assets, fallback);
            expect(matchingAsset.path).to.equal("/path");
        });
        it("case: request path with trailing /", () => {
            const assets = [
                { path: "/path", mimeType: "mimeType" },
                { path: "/path/index.html", mimeType: "mimeType" }
            ];
            const matchingAsset = findMatchingAsset("/path/", assets, fallback);
            expect(matchingAsset.path).to.equal("/path");
        });
        it("case: request path with prefix but no trailing /", () => {
            const assets = [
                { path: "/path", mimeType: "mimeType" },
                { path: "/path/index.html", mimeType: "mimeType" }
            ];
            const matchingAsset = findMatchingAsset("/prefix/path", assets, fallback);
            expect(matchingAsset.path).to.equal("/path");
        });
        it("case: request path with prefix and trailing /", () => {
            const assets = [
                { path: "/path", mimeType: "mimeType" },
                { path: "/path/index.html", mimeType: "mimeType" }
            ];
            const matchingAsset = findMatchingAsset("/prefix/path/", assets, fallback);
            expect(matchingAsset.path).to.equal("/path");
        });
    });
    describe("prioritizes dot-html matches over index-dot-html matches", () => {
        it("case: request path without trailing /", () => {
            const assets = [
                { path: "/path.html", mimeType: "mimeType" },
                { path: "/path/index.html", mimeType: "mimeType" }
            ];
            const matchingAsset = findMatchingAsset("/path", assets, fallback);
            expect(matchingAsset.path).to.equal("/path.html");
        });
        it("case: request path with trailing /", () => {
            const assets = [
                { path: "/path.html", mimeType: "mimeType" },
                { path: "/path/index.html", mimeType: "mimeType" }
            ];
            const matchingAsset = findMatchingAsset("/path/", assets, fallback);
            expect(matchingAsset.path).to.equal("/path.html");
        });
        it("case: request path with prefix but no trailing /", () => {
            const assets = [
                { path: "/path.html", mimeType: "mimeType" },
                { path: "/path/index.html", mimeType: "mimeType" }
            ];
            const matchingAsset = findMatchingAsset("/prefix/path", assets, fallback);
            expect(matchingAsset.path).to.equal("/path.html");
        });
        it("case: request path with prefix and trailing /", () => {
            const assets = [
                { path: "/path.html", mimeType: "mimeType" },
                { path: "/path/index.html", mimeType: "mimeType" }
            ];
            const matchingAsset = findMatchingAsset("/prefix/path/", assets, fallback);
            expect(matchingAsset.path).to.equal("/path.html");
        });
    });
    describe("prioritizes longer matches over shorter matches", () => {
        describe("case: perfect matches", () => {
            it("case: request path without trailing /", () => {
                const assets = [
                    { path: "/path", mimeType: "mimeType" },
                    { path: "/longer/path", mimeType: "mimeType" }
                ];
                const matchingAsset = findMatchingAsset("/longer/path", assets, fallback);
                expect(matchingAsset.path).to.equal("/longer/path");
            });
            it("case: request path with trailing /", () => {
                const assets = [
                    { path: "/path", mimeType: "mimeType" },
                    { path: "/longer/path", mimeType: "mimeType" }
                ];
                const matchingAsset = findMatchingAsset("/longer/path/", assets, fallback);
                expect(matchingAsset.path).to.equal("/longer/path");
            });
            it("case: request path with prefix but no trailing /", () => {
                const assets = [
                    { path: "/path", mimeType: "mimeType" },
                    { path: "/longer/path", mimeType: "mimeType" }
                ];
                const matchingAsset = findMatchingAsset("/prefix/longer/path", assets, fallback);
                expect(matchingAsset.path).to.equal("/longer/path");
            });
            it("case: request path with prefix and trailing /", () => {
                const assets = [
                    { path: "/path", mimeType: "mimeType" },
                    { path: "/longer/path", mimeType: "mimeType" }
                ];
                const matchingAsset = findMatchingAsset("/prefix/longer/path/", assets, fallback);
                expect(matchingAsset.path).to.equal("/longer/path");
            });
        });
        describe("case: dot-html matches", () => {
            it("case: request path without trailing /", () => {
                const assets = [
                    { path: "/path.html", mimeType: "mimeType" },
                    { path: "/longer/path.html", mimeType: "mimeType" }
                ];
                const matchingAsset = findMatchingAsset("/longer/path", assets, fallback);
                expect(matchingAsset.path).to.equal("/longer/path.html");
            });
            it("case: request path with trailing /", () => {
                const assets = [
                    { path: "/path.html", mimeType: "mimeType" },
                    { path: "/longer/path.html", mimeType: "mimeType" }
                ];
                const matchingAsset = findMatchingAsset("/longer/path/", assets, fallback);
                expect(matchingAsset.path).to.equal("/longer/path.html");
            });
            it("case: request path with prefix but no trailing /", () => {
                const assets = [
                    { path: "/path.html", mimeType: "mimeType" },
                    { path: "/longer/path.html", mimeType: "mimeType" }
                ];
                const matchingAsset = findMatchingAsset("/prefix/longer/path", assets, fallback);
                expect(matchingAsset.path).to.equal("/longer/path.html");
            });
            it("case: request path with prefix and trailing /", () => {
                const assets = [
                    { path: "/path.html", mimeType: "mimeType" },
                    { path: "/longer/path.html", mimeType: "mimeType" }
                ];
                const matchingAsset = findMatchingAsset("/prefix/longer/path/", assets, fallback);
                expect(matchingAsset.path).to.equal("/longer/path.html");
            });
        });
        describe("case: index-dot-html matches", () => {
            it("case: request path without trailing /", () => {
                const assets = [
                    { path: "/path/index.html", mimeType: "mimeType" },
                    { path: "/longer/path/index.html", mimeType: "mimeType" }
                ];
                const matchingAsset = findMatchingAsset("/longer/path", assets, fallback);
                expect(matchingAsset.path).to.equal("/longer/path/index.html");
            });
            it("case: request path with trailing /", () => {
                const assets = [
                    { path: "/path/index.html", mimeType: "mimeType" },
                    { path: "/longer/path/index.html", mimeType: "mimeType" }
                ];
                const matchingAsset = findMatchingAsset("/longer/path/", assets, fallback);
                expect(matchingAsset.path).to.equal("/longer/path/index.html");
            });
            it("case: request path with prefix but no trailing /", () => {
                const assets = [
                    { path: "/path/index.html", mimeType: "mimeType" },
                    { path: "/longer/path/index.html", mimeType: "mimeType" }
                ];
                const matchingAsset = findMatchingAsset("/prefix/longer/path", assets, fallback);
                expect(matchingAsset.path).to.equal("/longer/path/index.html");
            });
            it("case: request path with prefix and trailing /", () => {
                const assets = [
                    { path: "/path/index.html", mimeType: "mimeType" },
                    { path: "/longer/path/index.html", mimeType: "mimeType" }
                ];
                const matchingAsset = findMatchingAsset("/prefix/longer/path/", assets, fallback);
                expect(matchingAsset.path).to.equal("/longer/path/index.html");
            });
        });
    });
});
