import { AxiosInstance } from "axios";

import IConfiguration from "./IConfiguration";

export interface IApp {
    id: string;
    name: string;
    defaultConfiguration: IConfiguration;
}

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
        name: string;
        defaultConfiguration?: IConfiguration;
    }): Promise<IApp> {
        const result = await this.axios.post("/apps", app);
        return result.data;
    }

    async delete(id: string): Promise<void> {
        await this.axios.delete(`/apps/${id}`);
    }

    async updateName(id: string, name: string): Promise<IApp> {
        const result = await this.axios.put(
            `/apps/${id}/name`,
            JSON.stringify(name),
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
        return result.data;
    }

    async updateDefaultConfiguration(
        id: string,
        defaultConfiguration: IConfiguration
    ): Promise<IApp> {
        const result = await this.axios.put(
            `/apps/${id}/defaultConfiguration`,
            defaultConfiguration
        );
        return result.data;
    }
}
