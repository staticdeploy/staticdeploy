import { expect } from "chai";
import { shallow } from "enzyme";
import React from "react";

import Logo from "../../../src/components/Logo";

describe("Logo", () => {
    it("renders an img", () => {
        const logo = shallow(<Logo />);
        expect(logo.find("img")).to.have.length(1);
    });
});
