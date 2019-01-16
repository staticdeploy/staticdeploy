import { IBundle } from "@staticdeploy/common-types";
import { AxiosInstance } from "axios";

import parseDates from "./parseDates";

export default class BundlesClient {
    constructor(private axios: AxiosInstance) {}

    async getNames(): Promise<string[]> {
        const result = await this.axios.get("/bundleNames");
        return result.data;
    }

    async getTagsByName(name: string): Promise<string[]> {
        const result = await this.axios.get(`/bundleNames/${name}/bundleTags`);
        return result.data;
    }

    async getByNameAndTag(name: string, tag: string): Promise<IBundle[]> {
        const result = await this.axios.get(
            `/bundleNames/${name}/bundleTags/${tag}/bundles`
        );
        return result.data.map(parseDates);
    }

    async getAll(): Promise<
        Pick<IBundle, "id" | "name" | "tag" | "createdAt">[]
    > {
        const result = await this.axios.get("/bundles");
        return result.data.map(parseDates);
    }

    async getOne(id: string): Promise<IBundle> {
        const result = await this.axios.get(`/bundles/${id}`);
        return parseDates(result.data);
    }

    async create(bundle: {
        name: string;
        tag: string;
        description: string;
        /** base64 string of the tar.gz of the directory to deploy */
        content: string;
        fallbackAssetPath: string;
        fallbackStatusCode: number;
        headers: {
            [assetMatcher: string]: {
                [headerName: string]: string;
            };
        };
    }): Promise<IBundle> {
        const result = await this.axios.post("/bundles", bundle);
        return parseDates(result.data);
    }

    async delete(id: string): Promise<void> {
        await this.axios.delete(`/bundles/${id}`);
    }

    async deleteByNameAndTag(name: string, tag: string): Promise<void> {
        await this.axios.delete(
            `/bundleNames/${name}/bundleTags/${tag}/bundles`
        );
    }
}
