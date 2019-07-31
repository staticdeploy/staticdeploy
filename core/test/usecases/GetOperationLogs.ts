import { expect } from "chai";

import GetOperationLogs from "../../src/usecases/GetOperationLogs";
import { getMockDependencies } from "../testUtils";

describe("usecase GetOperationLogs", () => {
    it("returns the operationLogs found with the specified search filters (none for now)", async () => {
        const deps = getMockDependencies();
        const mockOperationLogs = [] as any;
        deps.storages.operationLogs.findMany.resolves(mockOperationLogs);
        const getOperationLogs = new GetOperationLogs(deps);
        const operationLogs = await getOperationLogs.exec();
        expect(operationLogs).to.equal(mockOperationLogs);
    });
});
