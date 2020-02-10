import { expect } from "chai";
import { shallow } from "enzyme";
import React from "react";

import ExternalCacheConfigurationFieldRO from "../../../src/components/ExternalCacheConfigurationFieldRO";
import TextFieldRO from "../../../src/components/TextFieldRO";

describe("ExternalCacheConfigurationFieldRO", () => {
    it("renders a TextFieldRO for each IExternalCacheType.configurationField, passing in its IExternalCache.configuration value", () => {
        const supportedExternalCacheType = {
            name: "type",
            label: "label",
            configurationFields: [
                { name: "name0", label: "label0", placeholder: "placeholder0" },
                { name: "name1", label: "label1", placeholder: "placeholder1" },
                { name: "name2", label: "label2", placeholder: "placeholder2" }
            ]
        };
        const externalCacheConfigurationFieldRO = shallow(
            <ExternalCacheConfigurationFieldRO
                title="title"
                externalCacheType="type"
                externalCacheConfiguration={{
                    name0: "value0",
                    name1: "value1",
                    name2: "value2"
                }}
                supportedExternalCacheTypes={[supportedExternalCacheType]}
            />
        );
        const textFieldROs = externalCacheConfigurationFieldRO.find(
            TextFieldRO
        );
        expect(textFieldROs).to.have.length(
            supportedExternalCacheType.configurationFields.length
        );
        const fieldValues = textFieldROs.map(textFieldRO =>
            textFieldRO.prop("value")
        );
        expect(fieldValues.sort()).to.deep.equal(
            ["value0", "value1", "value2"].sort()
        );
    });
});
