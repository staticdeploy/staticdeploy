import { IConfiguration, IEntrypoint } from "@staticdeploy/storage";
import { AxiosInstance } from "axios";

import parseDates from "./parseDates";

export default class EntrypointsClient {
    constructor(private axios: AxiosInstance) {}

    async getAll(filter?: { appIdOrName?: string }): Promise<IEntrypoint[]> {
        const result = await this.axios.get("/entrypoints", { params: filter });
        return result.data.map(parseDates);
    }

    async getOne(id: string): Promise<IEntrypoint> {
        const result = await this.axios.get(`/entrypoints/${id}`);
        return parseDates(result.data);
    }

    async create(entrypoint: {
        appId: string;
        bundleId?: string | null;
        redirectTo?: string | null;
        urlMatcher: string;
        configuration?: IConfiguration | null;
    }): Promise<IEntrypoint> {
        const result = await this.axios.post("/entrypoints", entrypoint);
        return parseDates(result.data);
    }

    async delete(id: string): Promise<void> {
        await this.axios.delete(`/entrypoints/${id}`);
    }

    async update(
        id: string,
        patch: {
            appId?: string;
            bundleId?: string | null;
            redirectTo?: string | null;
            urlMatcher?: string;
            configuration?: IConfiguration | null;
        }
    ): Promise<IEntrypoint> {
        const result = await this.axios.patch(`/entrypoints/${id}`, patch);
        return parseDates(result.data);
    }
}
