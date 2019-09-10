import { expect } from "chai";
import { shallow } from "enzyme";
import React from "react";

import { WrappedRolesField } from "../../../src/components/RolesField";
import TextField from "../../../src/components/TextField";

describe("RolesField", () => {
    describe("label prop", () => {
        it("when a label is specified, renders it inside a div.ant-form-item-label", () => {
            const rolesField = shallow(
                <WrappedRolesField
                    name="name"
                    fields={{ map: () => null } as any}
                    meta={{} as any}
                    label="label"
                />
            );
            expect(rolesField.find("div.ant-form-item-label")).to.have.length(
                1
            );
        });
        it("when a label is not specified, doesn't render any div.ant-form-item-label", () => {
            const rolesField = shallow(
                <WrappedRolesField
                    name="name"
                    fields={{ map: () => null } as any}
                    meta={{} as any}
                />
            );
            expect(rolesField.find("div.ant-form-item-label")).to.have.length(
                0
            );
        });
    });

    it("for each role passed by redux-form, renders a TextField with the correct name", () => {
        const rolesField = shallow(
            <WrappedRolesField
                name="name"
                fields={{ map: (fn: any) => fn("fieldName", 0) } as any}
                meta={{} as any}
            />
        );
        const textFields = rolesField.find(TextField);
        expect(textFields).to.have.length(1);
        const [fieldName] = textFields.map(textField => textField.prop("name"));
        expect(fieldName).to.equal("fieldName");
    });
});
