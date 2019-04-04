import { OperationLogNotFoundError } from "@staticdeploy/storage";

import convroute from "common/convroute";
import IBaseRequest from "common/IBaseRequest";
import storage from "services/storage";

interface IRequest extends IBaseRequest {
    params: {
        operationLogId: string;
    };
}

export default convroute({
    path: "/operationLogs/:operationLogId",
    method: "get",
    description: "Get operation log",
    tags: ["operationLogs"],
    responses: {
        "200": { description: "Returns the operation log" },
        "404": { description: "Operation log not found" }
    },
    handler: async (req: IRequest, res) => {
        const operationLog = await storage.operationLogs.findOneById(
            req.params.operationLogId
        );

        // Ensure the operation log exists
        if (!operationLog) {
            throw new OperationLogNotFoundError(req.params.operationLogId);
        }

        res.status(200).send(operationLog);
    }
});
