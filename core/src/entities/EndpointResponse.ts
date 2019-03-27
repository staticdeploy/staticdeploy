import { IAsset } from "./Asset";

export interface IEndpointResponse {
    statusCode: number;
    headers: IAsset["headers"];
    body?: Buffer;
}
