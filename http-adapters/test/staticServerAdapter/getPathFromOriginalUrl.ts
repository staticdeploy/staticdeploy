import { expect } from "chai";

import getPathFromOriginalUrl from "../../src/staticServerAdapter/getPathFromOriginalUrl";

describe("staticServerAdapter getPathFromOriginalUrl", () => {
    describe("returns the path form req.originalUrl", () => {
        it("case: originalUrl without querystring or hash", () => {
            const path = getPathFromOriginalUrl("/path");
            expect(path).to.equal("/path");
        });

        it("case: originalUrl with querystring", () => {
            const path = getPathFromOriginalUrl(
                "/path?querystring=querystring"
            );
            expect(path).to.equal("/path");
        });

        it("case: originalUrl with hash", () => {
            const path = getPathFromOriginalUrl("/path#hash");
            expect(path).to.equal("/path");
        });

        it("case: originalUrl with querystring and hash", () => {
            const path = getPathFromOriginalUrl(
                "/path?querystring=querystring#hash"
            );
            expect(path).to.equal("/path");
        });
    });
});
