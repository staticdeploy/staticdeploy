import { expect } from "chai";

import appendDotHtml from "common/appendDotHtml";

describe("common appendDotHtml", () => {
    it("if the string ends with a slash, removes the slash and appends .html", () => {
        expect(appendDotHtml("/asset/")).to.equal("/asset.html");
    });
    it("if the string doesn't end with a slash, appends .html", () => {
        expect(appendDotHtml("/asset")).to.equal("/asset.html");
    });
});
