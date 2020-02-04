import { IExternalCache } from "@staticdeploy/core";
import { AxiosInstance } from "axios";

export default class ExternalCachesClient {
    constructor(private axios: AxiosInstance) {}

    async getAll(): Promise<IExternalCache[]> {
        const result = await this.axios.get("/externalCaches");
        return result.data;
    }

    async getOne(id: string): Promise<IExternalCache> {
        const result = await this.axios.get(`/externalCaches/${id}`);
        return result.data;
    }

    async create(externalCache: {
        domain: IExternalCache["domain"];
        type: IExternalCache["type"];
        configuration: IExternalCache["configuration"];
    }): Promise<IExternalCache> {
        const result = await this.axios.post("/externalCaches", externalCache);
        return result.data;
    }

    async update(
        id: string,
        patch: {
            domain?: IExternalCache["domain"];
            type?: IExternalCache["type"];
            configuration?: IExternalCache["configuration"];
        }
    ): Promise<IExternalCache> {
        const result = await this.axios.patch(`/externalCaches/${id}`, patch);
        return result.data;
    }

    async delete(id: string): Promise<void> {
        await this.axios.delete(`/externalCaches/${id}`);
    }
}
