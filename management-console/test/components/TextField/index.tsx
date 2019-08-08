import Form from "antd/es/form";
import Input from "antd/es/input";
import { expect } from "chai";
import { shallow } from "enzyme";
import React from "react";

import { WrappedTextField } from "../../../src/components/TextField";

describe("TextField", () => {
    describe("when the field has an error", () => {
        it("if it hasn't been touched, displays no error", () => {
            const props: any = {
                meta: { error: "error", touched: false },
                input: {}
            };
            const textField = shallow(<WrappedTextField {...props} />);
            expect(textField.find(Form.Item).prop("validateStatus")).to.equal(
                undefined
            );
            expect(textField.find(Form.Item).prop("help")).to.equal(undefined);
        });

        it("if it has been touched and prop inlineError is not true, displays a help and no suffix on the Input component", () => {
            const props: any = {
                meta: { error: "error", touched: true },
                input: {}
            };
            const textField = shallow(<WrappedTextField {...props} />);
            expect(textField.find(Form.Item).prop("validateStatus")).to.equal(
                "error"
            );
            expect(textField.find(Form.Item).prop("help")).to.equal("error");
            expect(textField.find(Input).prop("suffix")).to.have.property(
                "type",
                "span"
            );
        });

        it("if it has been touched and prop inlineError is true, displays no help but a suffix on the Input component", () => {
            const props: any = {
                meta: { error: "error", touched: true },
                input: {},
                inlineError: true
            };
            const textField = shallow(<WrappedTextField {...props} />);
            expect(textField.find(Form.Item).prop("validateStatus")).to.equal(
                "error"
            );
            expect(textField.find(Form.Item).prop("help")).to.equal(undefined);
            expect(textField.find(Input).prop("suffix")).not.to.have.property(
                "type",
                "span"
            );
        });
    });
});
