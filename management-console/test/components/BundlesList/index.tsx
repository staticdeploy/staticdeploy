import { IBundle } from "@staticdeploy/core";
import Table from "antd/lib/table";
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
        assets: [
            {
                path: "/fallback",
                mimeType: "application/octet-stream",
                headers: {},
            },
        ],
        fallbackAssetPath: "/fallback",
        fallbackStatusCode: 200,
        createdAt: new Date("1970"),
        ...partial,
    };
}

describe("BundlesList", () => {
    it("renders bundles ordered by createdAt (descending order)", () => {
        const bundlesList = shallow(
            <BundlesList
                bundles={[
                    getBundle({ id: "0", createdAt: new Date("1970") }),
                    getBundle({ id: "1", createdAt: new Date("1971") }),
                    getBundle({ id: "2", createdAt: new Date("1972") }),
                ]}
            />
        );
        const sortedBundles = bundlesList
            .find(Table)
            .prop("dataSource") as IBundle[];
        const sortedIds = sortedBundles.map((bundle) => bundle.id);
        expect(sortedIds).to.deep.equal(["2", "1", "0"]);
    });
});
