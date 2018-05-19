import { IBundle } from "@staticdeploy/common-types";
import { expect } from "chai";
import { shallow } from "enzyme";
import React from "react";

import BundlesList from "../../../src/components/BundlesList";

function getBundle(partial: Partial<IBundle>) {
    return {
        id: "0",
        name: "name",
        tag: "tag",
        description: "description",
        hash: "hash",
        assets: [],
        createdAt: new Date("1970"),
        ...partial
    };
}

describe("BundlesList", () => {
    it("renders bundles ordered by createdAt (descending order)", () => {
        const bundlesList = shallow(
            <BundlesList
                bundles={[
                    getBundle({ id: "0", createdAt: new Date("1970") }),
                    getBundle({ id: "1", createdAt: new Date("1971") }),
                    getBundle({ id: "2", createdAt: new Date("1972") })
                ]}
            />
        );
        const renderedIds = bundlesList
            .find(".c-BundlesList-item-id code")
            .map(codeElement => codeElement.text());
        expect(renderedIds).to.deep.equal(["2", "1", "0"]);
    });
});
