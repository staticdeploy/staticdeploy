import { expect } from "chai";

import { AuthenticationRequiredError } from "../../src/common/errors";
import GetOperationLogs from "../../src/usecases/GetOperationLogs";
import { getMockDependencies } from "../testUtils";

describe("usecase GetOperationLogs", () => {
    it("throws AuthenticationRequiredError if the request is not authenticated", async () => {
        const deps = getMockDependencies();
        deps.requestContext.userId = null;
        const getOperationLogs = new GetOperationLogs(deps);
        const getOperationLogsPromise = getOperationLogs.exec();
        await expect(getOperationLogsPromise).to.be.rejectedWith(
            AuthenticationRequiredError
        );
        await expect(getOperationLogsPromise).to.be.rejectedWith(
            "This operation requires the request to be authenticated"
        );
    });

    it("returns the operationLogs found with the specified search filters (none for now)", async () => {
        const deps = getMockDependencies();
        const mockOperationLogs = [] as any;
        deps.operationLogsStorage.findMany.resolves(mockOperationLogs);
        const getOperationLogs = new GetOperationLogs(deps);
        const operationLogs = await getOperationLogs.exec();
        expect(operationLogs).to.equal(mockOperationLogs);
    });
});
