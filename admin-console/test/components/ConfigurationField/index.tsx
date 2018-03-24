import { expect } from "chai";
import { shallow } from "enzyme";
import React from "react";

import { WrappedConfigurationField } from "../../../src/components/ConfigurationField";
import TextField from "../../../src/components/TextField";

describe("ConfigurationField", () => {
    describe("label prop", () => {
        it("when a label is specified, renders it inside a div.ant-form-item-label", () => {
            const configurationField = shallow(
                <WrappedConfigurationField
                    name="name"
                    fields={{ map: () => null } as any}
                    meta={{} as any}
                    label="label"
                />
            );
            expect(
                configurationField.find("div.ant-form-item-label")
            ).to.have.length(1);
        });
        it("when a label is not specified, doesn't render any div.ant-form-item-label", () => {
            const configurationField = shallow(
                <WrappedConfigurationField
                    name="name"
                    fields={{ map: () => null } as any}
                    meta={{} as any}
                />
            );
            expect(
                configurationField.find("div.ant-form-item-label")
            ).to.have.length(0);
        });
    });

    describe("colon prop", () => {
        it("when colon === false, adds the ant-form-item-no-colon class to the top-level div", () => {
            const configurationField = shallow(
                <WrappedConfigurationField
                    name="name"
                    fields={{ map: () => null } as any}
                    meta={{} as any}
                    colon={false}
                />
            );
            expect(
                configurationField.is("div.ant-form-item-no-colon")
            ).to.equal(true);
        });
        it("when colon !== false, doesn't add the ant-form-item-no-colon class to the top-level div", () => {
            const configurationField = shallow(
                <WrappedConfigurationField
                    name="name"
                    fields={{ map: () => null } as any}
                    meta={{} as any}
                />
            );
            expect(
                configurationField.is("div.ant-form-item-no-colon")
            ).to.equal(false);
        });
    });

    it("for each kvPair field passed by redux-form, renders a TextField for the key and one for the value", () => {
        const configurationField = shallow(
            <WrappedConfigurationField
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
