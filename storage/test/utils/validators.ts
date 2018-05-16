import { expect } from "chai";
import { repeat } from "lodash";

import * as validators from "../../src/utils/validators";

describe("validator isConfigurationValid", () => {
    describe("returns true when the passed-in configuration is valid", () => {
        [
            {},
            { key: "value" },
            { key: "value", otherKey: "otherValue" },
            { "key-with-special-chars": "value" }
        ].forEach(configuration => {
            it(`case: ${JSON.stringify(configuration)}`, () => {
                expect(validators.isConfigurationValid(configuration)).to.equal(
                    true
                );
            });
        });
    });
    describe("returns false when the passed-in configuration is not valid", () => {
        [
            "not-an-object",
            0,
            true,
            null,
            [],
            { key: 0 },
            { key: {} },
            { key: [] },
            { key: true },
            { key: null }
        ].forEach(configuration => {
            it(`case: ${JSON.stringify(configuration)}`, () => {
                expect(validators.isConfigurationValid(configuration)).to.equal(
                    false
                );
            });
        });
    });
});

describe("validator isAppNameValid", () => {
    describe("returns true when the passed-in name is valid", () => {
        [
            "name",
            "name_with_underscores",
            "name-with-dashes",
            "name.with.dots",
            "name/with/slashes",
            "name-with-numbers-1234567890",
            "name-with-UPPERCASE-chars"
        ].forEach(name => {
            it(`case: ${name}`, () => {
                expect(validators.isAppNameValid(name)).to.equal(true);
            });
        });
    });
    describe("returns false when the passed-in name is not valid", () => {
        [
            "",
            "name-with-unsupported-chars-@",
            "name-with-unsupported-chars-#",
            repeat("name-too-long-", 50)
        ].forEach(name => {
            it(`case: ${name}`, () => {
                expect(validators.isAppNameValid(name)).to.equal(false);
            });
        });
    });
});

describe("validator isEntrypointUrlMatcherValid", () => {
    describe("returns true when the passed-in urlMatcher is valid", () => {
        [
            "domain.com/",
            "domain.com/path/",
            "subdomain.domain.com/path/subpath/"
        ].forEach(urlMatcher => {
            it(`case: ${urlMatcher}`, () => {
                expect(
                    validators.isEntrypointUrlMatcherValid(urlMatcher)
                ).to.equal(true);
            });
        });
    });
    describe("returns false when the passed-in urlMatcher is not valid", () => {
        [
            "http://domain.com/",
            "domain.com",
            "domain.com/path",
            "domain.com/path/../subpath/"
        ].forEach(urlMatcher => {
            it(`case: ${urlMatcher}`, () => {
                expect(
                    validators.isEntrypointUrlMatcherValid(urlMatcher)
                ).to.equal(false);
            });
        });
    });
});

describe("validator isBundleNameOrTagValid", () => {
    describe("returns true when the passed-in name or tag is valid", () => {
        [
            "letters",
            "letters_and_underscores",
            "letters-and-dashes",
            "letters.and.dots",
            "letters/and/slashes",
            "letters0and0numbers",
            "0123456789",
            "combination0_./-",
            // Possible names of git branches and tags
            "master",
            "feature/some-feature",
            "v1.0.0",
            "1.0.0-beta1"
        ].forEach(nameOrTag => {
            it(`case: ${nameOrTag}`, () => {
                expect(validators.isBundleNameOrTagValid(nameOrTag)).to.equal(
                    true
                );
            });
        });
    });
    describe("returns false when the passed-in name or tag is not valid", () => {
        [
            "",
            "with-colon:",
            "with-unsupported-chars*",
            "with-spaces ",
            "with-backslashes\\",
            repeat("too-long-", 50)
        ].forEach(nameOrTag => {
            it(`case: ${nameOrTag}`, () => {
                expect(validators.isBundleNameOrTagValid(nameOrTag)).to.equal(
                    false
                );
            });
        });
    });
});

describe("validator isBundleNameTagCombinationValid", () => {
    describe("returns true when the passed-in name:tag combination is valid", () => {
        [
            "name:tag",
            "name_name:tag/tag",
            "name/name:v1.0.0",
            "name.name/name:tag_.tag"
        ].forEach(nameTagCombination => {
            it(`case: ${nameTagCombination}`, () => {
                expect(
                    validators.isBundleNameTagCombinationValid(
                        nameTagCombination
                    )
                ).to.equal(true);
            });
        });
    });
    describe("returns false when the passed-in name:tag combination is not valid", () => {
        [
            "no-colon",
            "no-tag:",
            ":no-name",
            "invalid-name*:tag",
            "invalid-tag:taag*"
        ].forEach(nameTagCombination => {
            it(`case: ${nameTagCombination}`, () => {
                expect(
                    validators.isBundleNameTagCombinationValid(
                        nameTagCombination
                    )
                ).to.equal(false);
            });
        });
    });
});
