import { expect } from "chai";

import getConfigurationScript from "../../../src/usecases/RespondToEndpointRequest/getConfigurationScript";

describe("getConfigurationScript", () => {
    it("generates and returns the configuration script content and sha", () => {
        const configurationScript = getConfigurationScript({ KEY: "VALUE" });
        expect(configurationScript).to.deep.equal({
            content: 'window.APP_CONFIG={"KEY":"VALUE"};',
            sha256: "US+OjL8S9TNtlcjHX2ro44frMkCkcTiKXQtgIC3aPqY="
        });
    });
});
