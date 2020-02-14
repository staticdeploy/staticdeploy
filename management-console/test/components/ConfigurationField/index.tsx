import { expect } from "chai";
import { shallow } from "enzyme";
import React from "react";

import { WrappedConfigurationField } from "../../../src/components/ConfigurationField";
import TextField from "../../../src/components/TextField";

describe("ConfigurationField", () => {
    it("for each kvPair field passed by redux-form, renders a TextField for the key and one for the value", () => {
        const configurationField = shallow(
            <WrappedConfigurationField
                label="label"
                name="name"
                fields={{ map: (fn: any) => fn("fieldName", 0) } as any}
                meta={{} as any}
            />
        );
        const textFields = configurationField.find(TextField);
        expect(textFields).to.have.length(2);
        const fieldNames = textFields.map(textField => textField.prop("name"));
        expect(fieldNames.sort()).to.deep.equal(
            ["fieldName.key", "fieldName.value"].sort()
        );
    });
});
