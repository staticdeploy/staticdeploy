import { IApp } from "@staticdeploy/core";
import { AxiosInstance } from "axios";

export default class AppsClient {
    constructor(private axios: AxiosInstance) {}

    async getAll(): Promise<IApp[]> {
        const result = await this.axios.get("/apps");
        return result.data;
    }

    async getOne(id: string): Promise<IApp> {
        const result = await this.axios.get(`/apps/${id}`);
        return result.data;
    }

    async create(app: {
        name: IApp["name"];
        defaultConfiguration?: IApp["defaultConfiguration"];
    }): Promise<IApp> {
        const result = await this.axios.post("/apps", app);
        return result.data;
    }

    async update(
        id: string,
        patch: {
            defaultConfiguration?: IApp["defaultConfiguration"];
        }
    ): Promise<IApp> {
        const result = await this.axios.patch(`/apps/${id}`, patch);
        return result.data;
    }

    async delete(id: string): Promise<void> {
        await this.axios.delete(`/apps/${id}`);
    }
}
