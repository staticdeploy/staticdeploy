import { expect } from "chai";

import addTrailingSlash from "../../../src/usecases/RespondToEndpointRequest/addTrailingSlash";

describe("RespondToEndpointRequest.addTrailingSlash", () => {
    it("if the path doesn't end with a slash, appends it", () => {
        expect(addTrailingSlash("/path")).to.equal("/path/");
    });

    it("if the path ends with a slash, does nothing", () => {
        expect(addTrailingSlash("/path/")).to.equal("/path/");
    });
});
