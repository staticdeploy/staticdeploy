import { IBundle } from "@staticdeploy/core";
import { AxiosInstance } from "axios";

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
        return result.data;
    }

    async getAll(): Promise<
        Pick<IBundle, "id" | "name" | "tag" | "createdAt">[]
    > {
        const result = await this.axios.get("/bundles");
        return result.data;
    }

    async getOne(id: string): Promise<IBundle> {
        const result = await this.axios.get(`/bundles/${id}`);
        return result.data;
    }

    async create(bundle: {
        name: IBundle["name"];
        tag: IBundle["tag"];
        description: IBundle["description"];
        /** base64 string of the tar.gz of the directory to deploy */
        content: string;
        fallbackAssetPath: IBundle["fallbackAssetPath"];
        fallbackStatusCode: IBundle["fallbackStatusCode"];
        headers: {
            [assetMatcher: string]: {
                [headerName: string]: string;
            };
        };
    }): Promise<IBundle> {
        const result = await this.axios.post("/bundles", bundle);
        return result.data;
    }

    async deleteByNameAndTag(name: string, tag: string): Promise<void> {
        await this.axios.delete(
            `/bundleNames/${name}/bundleTags/${tag}/bundles`
        );
    }
}
