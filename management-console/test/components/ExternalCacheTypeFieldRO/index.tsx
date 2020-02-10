import { expect } from "chai";
import { shallow } from "enzyme";
import React from "react";

import ExternalCacheTypeFieldRO from "../../../src/components/ExternalCacheTypeFieldRO";

describe("ExternalCacheTypeFieldRO", () => {
    it("renders the label of the specified external cache type", () => {
        const supportedExternalCacheTypes = [
            { name: "type0", label: "label0", configurationFields: [] }
        ];
        const externalCacheTypeField = shallow(
            <ExternalCacheTypeFieldRO
                title="title"
                externalCacheType="type0"
                supportedExternalCacheTypes={supportedExternalCacheTypes}
            />
        );
        expect(externalCacheTypeField.contains("label0")).to.equal(true);
    });
});
