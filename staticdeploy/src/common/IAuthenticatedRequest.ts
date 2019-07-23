import { IBaseRequest } from "@staticdeploy/http-adapters";

export interface IUser {
    id: string;
}
export default interface IAuthenticatedRequest extends IBaseRequest {
    user: IUser | null;
}
