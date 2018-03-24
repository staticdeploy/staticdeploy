import { IBundle } from "@staticdeploy/storage";
import { AxiosInstance } from "axios";

import parseDates from "./parseDates";

export default class BundlesClient {
    constructor(private axios: AxiosInstance) {}

    async getAll(): Promise<IBundle[]> {
        const result = await this.axios.get("/bundles");
        return result.data.map(parseDates);
    }

    async create(bundle: {
        name: string;
        tag: string;
        description: string;
        /** base64 string of the tar.gz of the directory to deploy */
        content: string;
    }): Promise<IBundle> {
        const result = await this.axios.post("/bundles", bundle);
        return parseDates(result.data);
    }

    async delete(id: string): Promise<void> {
        await this.axios.delete(`/bundles/${id}`);
    }
}
