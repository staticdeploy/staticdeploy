import { IStorages, Operation } from "@staticdeploy/core";
import { expect } from "chai";

export default (storages: IStorages) => {
    describe("OperationLogsStorage", () => {
        describe("create an operationLog and get it back when finding many", () => {
            it("case: parameters is an empty object", async () => {
                const operationLog = {
                    id: "id",
                    operation: Operation.createApp,
                    parameters: {},
                    performedBy: "performedBy",
                    performedAt: new Date()
                };
                await storages.operationLogs.createOne(operationLog);
                const foundOperationLogs = await storages.operationLogs.findMany();
                expect(foundOperationLogs).to.deep.equal([operationLog]);
            });

            it("case: parameters is a non-empty object", async () => {
                const operationLog = {
                    id: "id",
                    operation: Operation.createApp,
                    parameters: { key: "value" },
                    performedBy: "performedBy",
                    performedAt: new Date()
                };
                await storages.operationLogs.createOne(operationLog);
                const foundOperationLogs = await storages.operationLogs.findMany();
                expect(foundOperationLogs).to.deep.equal([operationLog]);
            });
        });
    });
};
