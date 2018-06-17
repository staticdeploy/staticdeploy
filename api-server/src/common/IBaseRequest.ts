import { IOperationLog } from "@staticdeploy/common-types";
import { Request } from "express";

import { Operation } from "services/operations";

export default interface IBaseRequest extends Request {
    log: import("bunyan");
    logOperation: (
        operation: Operation,
        parameters: IOperationLog["parameters"]
    ) => Promise<void>;
    user: {
        sub: string;
    };
}
