import { AxiosInstance } from "axios";

import parseDates from "./parseDates";

export interface IDeployment {
    id: string;
    entrypointId: string;
    description: string;
    createdAt: Date;
}

export default class DeploymentClient {
    constructor(private axios: AxiosInstance) {}

    async getAll(filter?: {
        entrypointIdOrUrlMatcher?: string;
    }): Promise<IDeployment[]> {
        const result = await this.axios.get("/deployments", { params: filter });
        return result.data.map(parseDates);
    }

    async create(deployment: {
        entrypointIdOrUrlMatcher: string;
        /** base64 string of the tar.gz of the directory to deploy */
        content: string;
        appIdOrName?: string;
        description?: string;
    }): Promise<IDeployment> {
        const result = await this.axios.post("/deployments", deployment);
        return parseDates(result.data);
    }

    async delete(id: string): Promise<void> {
        await this.axios.delete(`/deployments/${id}`);
    }
}
