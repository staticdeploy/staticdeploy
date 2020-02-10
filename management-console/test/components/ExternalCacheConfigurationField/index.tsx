import { expect } from "chai";
import { shallow } from "enzyme";
import React from "react";

import ExternalCacheConfigurationField from "../../../src/components/ExternalCacheConfigurationField";
import TextField from "../../../src/components/TextField";

describe("ExternalCacheConfigurationField", () => {
    it("doesn't render anything if externalCacheType is not specified", () => {
        const supportedExternalCacheType = {
            name: "type",
            label: "label",
            configurationFields: [
                { name: "name", label: "label", placeholder: "placeholder" }
            ]
        };
        const externalCacheConfigurationField = shallow(
            <ExternalCacheConfigurationField
                name="name"
                label="label"
                externalCacheType={undefined}
                supportedExternalCacheTypes={[supportedExternalCacheType]}
            />
        );
        expect(externalCacheConfigurationField.isEmptyRender()).to.equal(true);
    });

    it("renders a TextField for each IExternalCacheType.configurationField", () => {
        const supportedExternalCacheType = {
            name: "type",
            label: "label",
            configurationFields: [
                { name: "name0", label: "label0", placeholder: "placeholder0" },
                { name: "name1", label: "label1", placeholder: "placeholder1" },
                { name: "name2", label: "label2", placeholder: "placeholder2" }
            ]
        };
        const externalCacheConfigurationField = shallow(
            <ExternalCacheConfigurationField
                name="name"
                label="label"
                externalCacheType="type"
                supportedExternalCacheTypes={[supportedExternalCacheType]}
            />
        );
        const textFields = externalCacheConfigurationField.find(TextField);
        expect(textFields).to.have.length(
            supportedExternalCacheType.configurationFields.length
        );
        const fieldNames = textFields.map(textField => textField.prop("name"));
        expect(fieldNames.sort()).to.deep.equal(
            ["name0", "name1", "name2"].sort()
        );
    });
});
