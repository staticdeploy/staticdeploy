import { IOperationLog, Operation } from "@staticdeploy/common-types";
import Table from "antd/lib/table";
import { expect } from "chai";
import { shallow } from "enzyme";
import React from "react";

import OperationLogsList from "../../../src/components/OperationLogsList";

function getOperationLog(partial: Partial<IOperationLog>) {
    return {
        id: "0",
        operation: Operation.createApp,
        parameters: {},
        performedBy: "performedBy",
        performedAt: new Date(),
        ...partial
    };
}

describe("OperationLogsList", () => {
    it("renders a table with operation logs ordered by performedAt (descending order)", () => {
        const operationLogsList = shallow(
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
        const orderedIds = operationLogsList
            .find(Table)
            .prop<IOperationLog[]>("dataSource")
            .map(operationLog => operationLog.id);
        expect(orderedIds).to.deep.equal(["2", "1", "0"]);
    });
});
