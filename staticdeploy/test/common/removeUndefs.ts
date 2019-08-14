import { expect } from "chai";

import removeUndefs from "../../src/common/removeUndefs";

describe("util removeUndefs", () => {
    it("removes undefined properties from an object", () => {
        expect(removeUndefs({ a: undefined, b: 1 })).to.deep.equal({ b: 1 });
    });

    describe("doesn't remove other falsy properties", () => {
        it("case: null-s", () => {
            expect(removeUndefs({ a: null })).to.deep.equal({ a: null });
        });

        it("case: false-s", () => {
            expect(removeUndefs({ a: false })).to.deep.equal({ a: false });
        });

        it("case: empty strings", () => {
            expect(removeUndefs({ a: "" })).to.deep.equal({ a: "" });
        });

        it("case: zeroes", () => {
            expect(removeUndefs({ a: 0 })).to.deep.equal({ a: 0 });
        });

        it("case: NaN-s", () => {
            expect(removeUndefs({ a: NaN })).to.deep.equal({ a: NaN });
        });
    });
});
