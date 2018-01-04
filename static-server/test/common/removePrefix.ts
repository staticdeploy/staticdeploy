import { expect } from "chai";

import removePrefix from "common/removePrefix";

describe("common removePrefix", () => {
    describe("if the target string has the prefix, returns the target string without the prefix", () => {
        it("case: prefix.length = 0", () => {
            const target = "target";
            const prefix = "";
            expect(removePrefix(target, prefix)).to.equal("target");
        });
        it("case: 0 < prefix.length < taregt.length", () => {
            const target = "target";
            const prefix = "tar";
            expect(removePrefix(target, prefix)).to.equal("get");
        });
        it("case: prefix.length = taregt.length", () => {
            const target = "target";
            const prefix = "target";
            expect(removePrefix(target, prefix)).to.equal("");
        });
    });
    describe("if the target string has the prefix, returns the whole target string", () => {
        it("case: target doesn't start with prefix", () => {
            const target = "target";
            const prefix = "prefix";
            expect(removePrefix(target, prefix)).to.equal("target");
        });
        it("case: target doesn't start with prefix, but contains prefix", () => {
            const target = "target";
            const prefix = "arget";
            expect(removePrefix(target, prefix)).to.equal("target");
        });
        it("case: prefix starts with target but is longer than target", () => {
            const target = "target";
            const prefix = "target-and-more";
            expect(removePrefix(target, prefix)).to.equal("target");
        });
    });
});
