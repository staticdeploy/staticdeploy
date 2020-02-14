import Select from "antd/lib/select";
import { expect } from "chai";
import { shallow } from "enzyme";
import React from "react";
import { WrappedFieldProps } from "redux-form";

import { WrappedExternalCacheTypeField } from "../../../src/components/ExternalCacheTypeField";

describe("ExternalCacheTypeField", () => {
    it("renders a select option for each supported cache type", () => {
        const wrappedFieldProps: WrappedFieldProps = {
            meta: { error: "error", touched: false },
            input: {}
        } as any;
        const supportedExternalCacheTypes = [
            { name: "type0", label: "label0", configurationFields: [] },
            { name: "type1", label: "label1", configurationFields: [] },
            { name: "type2", label: "label2", configurationFields: [] }
        ];
        const externalCacheTypeField = shallow(
            <WrappedExternalCacheTypeField
                {...wrappedFieldProps}
                name="name"
                label="label"
                supportedExternalCacheTypes={supportedExternalCacheTypes}
            />
        );
        const options = externalCacheTypeField.find(Select.Option);
        expect(options).to.have.length(supportedExternalCacheTypes.length);
        const optionValues = options.map(option => option.prop("value"));
        expect(optionValues.sort()).to.deep.equal(
            ["type0", "type1", "type2"].sort()
        );
    });
});
