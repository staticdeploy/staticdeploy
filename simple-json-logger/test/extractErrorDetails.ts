import { expect } from "chai";

import extractErrorDetails from "../src/extractErrorDetails";

describe("extractErrorDetails", () => {
    describe("extracts the details of an error", () => {
        it("case: Error instance", () => {
            const error = new Error("message");
            expect(extractErrorDetails(error)).to.deep.equal({
                name: "Error",
                message: "message",
                stack: error.stack
            });
        });

        it("case: non-Error instance", () => {
            expect(extractErrorDetails("not an error")).to.deep.equal({
                name: undefined,
                message: undefined,
                stack: undefined
            });
        });
    });

    it("returns undefined if error is undefined", () => {
        expect(extractErrorDetails()).to.equal(undefined);
    });
});
