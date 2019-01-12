import { IOperationLog, Operation } from "@staticdeploy/common-types";
import { Request } from "express";

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
