import { ILogger } from "@staticdeploy/core";
import { IBaseRequest } from "@staticdeploy/http-adapters";

export default interface IRequestWithLoger extends IBaseRequest {
    logger: ILogger;
}
