import { IOperationLog } from "@staticdeploy/storage";

import IAuthenticatedRequest from "common/IAuthenticatedRequest";
import { Operation } from "services/operations";

export default interface IBaseRequest extends IAuthenticatedRequest {
    logOperation: (
        operation: Operation,
        parameters: IOperationLog["parameters"]
    ) => Promise<void>;
};
