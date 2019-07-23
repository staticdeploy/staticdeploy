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
                        { id: "0", name: "0", tag: "0", createdAt: "1970" },
                        { id: "1", name: "0", tag: "1", createdAt: "1971" },
                        { id: "2", name: "1", tag: "0", createdAt: "1972" },
                        { id: "3", name: "1", tag: "1", createdAt: "1973" },
                        { id: "4", name: "2", tag: "0", createdAt: "1974" },
                        { id: "5", name: "2", tag: "1", createdAt: "1975" }
                    ]
                }
            });
            expect(options).to.deep.equal([
                {
                    value: "0",
                    label: "0",
                    children: [
                        {
                            value: "0",
                            label: "0",
                            children: [
                                { value: "0", label: "0 (about 10 years)" }
                            ]
                        },
                        {
                            value: "1",
                            label: "1",
                            children: [
                                { value: "1", label: "1 (about 9 years)" }
                            ]
                        }
                    ]
                },
                {
                    value: "1",
                    label: "1",
                    children: [
                        {
                            value: "0",
                            label: "0",
                            children: [
                                { value: "2", label: "2 (about 8 years)" }
                            ]
                        },
                        {
                            value: "1",
                            label: "1",
                            children: [
                                { value: "3", label: "3 (about 7 years)" }
                            ]
                        }
                    ]
                },
                {
                    value: "2",
                    label: "2",
                    children: [
                        {
                            value: "0",
                            label: "0",
                            children: [
                                { value: "4", label: "4 (about 6 years)" }
                            ]
                        },
                        {
                            value: "1",
                            label: "1",
                            children: [
                                { value: "5", label: "5 (about 5 years)" }
                            ]
                        }
                    ]
                }
            ]);
        });
    });
});
