import { IEntrypoint } from "@staticdeploy/core";
import { AxiosInstance } from "axios";

export default class EntrypointsClient {
    constructor(private axios: AxiosInstance) {}

    async getAll(filter: { appId: string }): Promise<IEntrypoint[]> {
        const result = await this.axios.get("/entrypoints", { params: filter });
        return result.data;
    }

    async getOne(id: string): Promise<IEntrypoint> {
        const result = await this.axios.get(`/entrypoints/${id}`);
        return result.data;
    }

    async create(entrypoint: {
        appId: IEntrypoint["appId"];
        bundleId?: IEntrypoint["bundleId"];
        redirectTo?: IEntrypoint["redirectTo"];
        urlMatcher: IEntrypoint["urlMatcher"];
        configuration?: IEntrypoint["configuration"];
    }): Promise<IEntrypoint> {
        const result = await this.axios.post("/entrypoints", entrypoint);
        return result.data;
    }

    async update(
        id: string,
        patch: {
            bundleId?: IEntrypoint["bundleId"];
            redirectTo?: IEntrypoint["redirectTo"];
            configuration?: IEntrypoint["configuration"];
        }
    ): Promise<IEntrypoint> {
        const result = await this.axios.patch(`/entrypoints/${id}`, patch);
        return result.data;
    }

    async delete(id: string): Promise<void> {
        await this.axios.delete(`/entrypoints/${id}`);
    }
}
