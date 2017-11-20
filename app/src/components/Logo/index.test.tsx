import { shallow } from "enzyme";
import React from "react";

import Logo from ".";

describe("Logo", () => {
    it("renders an img", () => {
        const logo = shallow(<Logo />);
        expect(logo.find("img")).toHaveLength(1);
    });
});
