import { expect } from "chai";

import whitelistInlineScript from "../../../src/usecases/RespondToEndpointRequest/whitelistInlineScript";

describe("whitelistInlineScript", () => {
    it("returns the unmodified headers object is it doesn't include the CSP header", () => {
        const headers = {
            "not-content-security-policy": "value"
        };
        expect(whitelistInlineScript(headers, "sha256")).to.deep.equal(headers);
    });

    describe("adds the CSP directive whitelisting the provided script sha256", () => {
        it("case: simple CSP", () => {
            const headers = {
                "not-content-security-policy": "value",
                "content-security-policy": "default-src 'self'"
            };
            expect(whitelistInlineScript(headers, "sha256")).to.deep.equal({
                "not-content-security-policy": "value",
                "content-security-policy":
                    "default-src 'self'; script-src 'sha256-sha256'"
            });
        });

        it("case: complex CSP", () => {
            const headers = {
                "not-content-security-policy": "value",
                "content-security-policy":
                    "default-src 'self'; img-src *; media-src media1.com media2.com; script-src userscripts.example.com"
            };
            expect(whitelistInlineScript(headers, "sha256")).to.deep.equal({
                "not-content-security-policy": "value",
                "content-security-policy":
                    "default-src 'self'; img-src *; media-src media1.com media2.com; script-src userscripts.example.com 'sha256-sha256'"
            });
        });

        it("case: non-lowercase header key", () => {
            const headers = {
                "not-content-security-policy": "value",
                "Content-Security-Policy": "default-src 'self'"
            };
            expect(whitelistInlineScript(headers, "sha256")).to.deep.equal({
                "not-content-security-policy": "value",
                "Content-Security-Policy":
                    "default-src 'self'; script-src 'sha256-sha256'"
            });
        });
    });
});
