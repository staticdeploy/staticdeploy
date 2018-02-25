import { expect } from "chai";
import { shallow } from "enzyme";
import React from "react";

import ConfigurationFieldRO from "../../../src/components/ConfigurationFieldRO";

describe("ConfigurationFieldRO", () => {
    describe("for each configuration key-value pair", () => {
        it("renders the key", () => {
            const configurationField = shallow(
                <ConfigurationFieldRO
                    title="title"
                    configuration={{ key0: "value0", key1: "value1" }}
                />
            );
            expect(configurationField.contains("key0")).to.equal(true);
            expect(configurationField.contains("key1")).to.equal(true);
        });
        it("renders the value", () => {
            const configurationField = shallow(
                <ConfigurationFieldRO
                    title="title"
                    configuration={{ key0: "value0", key1: "value1" }}
                />
            );
            expect(configurationField.contains("value0")).to.equal(true);
            expect(configurationField.contains("value1")).to.equal(true);
        });
    });
});
