import { expect } from "chai";

import getConfigurationScript from "../../../src/usecases/RespondToEndpointRequest/getConfigurationScript";

describe("getConfigurationScript", () => {
    it("generates and returns the configuration script content and sha", () => {
        const configurationScript = getConfigurationScript({ KEY: "VALUE" });
        expect(configurationScript).to.deep.equal({
            content: 'window.APP_CONFIG={"KEY":"VALUE"};',
            sha256:
                "512f8e8cbf12f5336d95c8c75f6ae8e387eb3240a471388a5d0b60202dda3ea6"
        });
    });
});
