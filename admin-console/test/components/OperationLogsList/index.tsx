import { IOperationLog } from "@staticdeploy/sdk";
import { expect } from "chai";
import { shallow } from "enzyme";
import React from "react";

import OperationLogsList from "../../../src/components/OperationLogsList";

function getOperationLog(partial: Partial<IOperationLog>) {
    return {
        id: "0",
        operation: "operation",
        parameters: {},
        performedBy: "performedBy",
        performedAt: new Date(),
        ...partial
    };
}

describe("OperationLogsList", () => {
    it("renders operation logs ordered by performedAt (descending order)", () => {
        const operationlogsList = shallow(
            <OperationLogsList
                operationLogs={[
                    getOperationLog({
                        id: "0",
                        performedBy: "0",
                        performedAt: new Date("1970")
                    }),
                    getOperationLog({
                        id: "1",
                        performedBy: "1",
                        performedAt: new Date("1971")
                    }),
                    getOperationLog({
                        id: "2",
                        performedBy: "2",
                        performedAt: new Date("1972")
                    })
                ]}
            />
        );
        const renderedIds = operationlogsList
            .find(".c-OperationLogsList-item")
            .map(element =>
                // Get performedAt text from the third rendered Col
                element
                    .childAt(2)
                    .childAt(0)
                    .text()
            );
        expect(renderedIds).to.deep.equal(["2", "1", "0"]);
    });
});
