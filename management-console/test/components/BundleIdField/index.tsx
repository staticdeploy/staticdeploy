import { expect } from "chai";
import sinon, { SinonFakeTimers } from "sinon";

import { WrappedBundleIdField } from "../../../src/components/BundleIdField";

describe("BundleIdField", () => {
    describe("getOptions method", () => {
        let clock: SinonFakeTimers;
        after(() => {
            clock.restore();
        });

        it("creates the Cascader's options structure from a list of bundles", () => {
            clock = sinon.useFakeTimers(new Date("1980"));
            const getOptions = WrappedBundleIdField.prototype.getOptions;
            const options = getOptions.call({
                props: {
                    bundles: [
                        {
                            id: "0",
                            name: "0",
                            tag: "0",
                            createdAt: new Date("1970").toISOString(),
                        },
                        {
                            id: "1",
                            name: "0",
                            tag: "1",
                            createdAt: new Date("1971").toISOString(),
                        },
                        {
                            id: "2",
                            name: "1",
                            tag: "0",
                            createdAt: new Date("1972").toISOString(),
                        },
                        {
                            id: "3",
                            name: "1",
                            tag: "1",
                            createdAt: new Date("1973").toISOString(),
                        },
                        {
                            id: "4",
                            name: "2",
                            tag: "0",
                            createdAt: new Date("1974").toISOString(),
                        },
                        {
                            id: "5",
                            name: "2",
                            tag: "1",
                            createdAt: new Date("1975").toISOString(),
                        },
                    ],
                },
            });
            expect(options).to.deep.equal([
                {
                    value: "0",
                    label: "0",
                    children: [
                        {
                            value: "0",
                            label: "0",
                            children: [{ value: "0", label: "0 (10 years)" }],
                        },
                        {
                            value: "1",
                            label: "1",
                            children: [{ value: "1", label: "1 (9 years)" }],
                        },
                    ],
                },
                {
                    value: "1",
                    label: "1",
                    children: [
                        {
                            value: "0",
                            label: "0",
                            children: [{ value: "2", label: "2 (8 years)" }],
                        },
                        {
                            value: "1",
                            label: "1",
                            children: [{ value: "3", label: "3 (7 years)" }],
                        },
                    ],
                },
                {
                    value: "2",
                    label: "2",
                    children: [
                        {
                            value: "0",
                            label: "0",
                            children: [{ value: "4", label: "4 (6 years)" }],
                        },
                        {
                            value: "1",
                            label: "1",
                            children: [{ value: "5", label: "5 (5 years)" }],
                        },
                    ],
                },
            ]);
        });
    });
});
