import { expect } from "chai";
import { shallow } from "enzyme";
import React from "react";

import { WrappedRolesField } from "../../../src/components/RolesField";
import TextField from "../../../src/components/TextField";

describe("RolesField", () => {
    it("for each role passed by redux-form, renders a TextField with the correct name", () => {
        const rolesField = shallow(
            <WrappedRolesField
                name="name"
                label="label"
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
