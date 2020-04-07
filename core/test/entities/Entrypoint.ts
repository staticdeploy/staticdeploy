import { expect } from "chai";

import { isEntrypointUrlMatcherValid } from "../../src/entities/Entrypoint";

describe("Entrypoint entity validator isEntrypointUrlMatcherValid", () => {
    describe("returns true when the passed-in urlMatcher is valid", () => {
        [
            "domain.com/",
            "domain.com/path/",
            "subdomain.domain.com/path/subpath/",
        ].forEach((urlMatcher) => {
            it(`case: ${urlMatcher}`, () => {
                expect(isEntrypointUrlMatcherValid(urlMatcher)).to.equal(true);
            });
        });
    });

    describe("returns false when the passed-in urlMatcher is not valid", () => {
        [
            "http://domain.com/",
            "domain.com",
            "domain.com/path",
            "domain.com/path/../subpath/",
        ].forEach((urlMatcher) => {
            it(`case: ${urlMatcher}`, () => {
                expect(isEntrypointUrlMatcherValid(urlMatcher)).to.equal(false);
            });
        });
    });
});
