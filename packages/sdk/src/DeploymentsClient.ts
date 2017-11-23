import { AxiosInstance } from "axios";

export interface IDeployment {
    id: string;
    entrypointId: string;
}

export default class DeploymentClient {
    constructor(private axios: AxiosInstance) {}

    async getAll(filter?: { entrypointId?: string }): Promise<IDeployment[]> {
        const result = await this.axios.get("/deployments", {
            params: filter
        });
        return result.data;
    }

    // TODO: all other methods
}
