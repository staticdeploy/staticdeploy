import { IBaseRequest } from "@staticdeploy/http-adapters";

export default interface IRequestWithAuthToken extends IBaseRequest {
    authToken: string | null;
}
