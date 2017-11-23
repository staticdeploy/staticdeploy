import { AxiosInstance } from "axios";

import IConfiguration from "./IConfiguration";

export interface IEntrypoint {
    id: string;
    appId: string;
    urlMatcher: string;
    urlMatcherPriority: number;
    activeDeploymentId: string;
    smartRoutingEnabled: boolean;
    configuration?: IConfiguration;
}

export default class EntrypointsClient {
    constructor(private axios: AxiosInstance) {}

    async getAll(filter?: { appId?: string }): Promise<IEntrypoint[]> {
        const result = await this.axios.get("/entrypoints", {
            params: filter
        });
        return result.data;
    }

    // TODO: all other methods
}
