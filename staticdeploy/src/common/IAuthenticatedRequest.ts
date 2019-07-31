import { IUser } from "@staticdeploy/core";
import { IBaseRequest } from "@staticdeploy/http-adapters";

export default interface IAuthenticatedRequest extends IBaseRequest {
    user: IUser | null;
}
