import { expect } from "chai";

import toAbsolute from "common/toAbsolute";

describe("common toAbsolute", () => {
    it("makes a non absolute path absolute", () => {
        expect(toAbsolute("path/")).to.equal("/path/");
    });
    it("doesn't change an absolute path", () => {
        expect(toAbsolute("/path/")).to.equal("/path/");
    });
});
