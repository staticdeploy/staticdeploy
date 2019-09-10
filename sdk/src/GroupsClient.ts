import { IGroup } from "@staticdeploy/core";
import { AxiosInstance } from "axios";

import parseDates from "./parseDates";

export default class GroupsClient {
    constructor(private axios: AxiosInstance) {}

    async getAll(): Promise<IGroup[]> {
        const result = await this.axios.get("/groups");
        return result.data.map(parseDates);
    }

    async getOne(id: string): Promise<IGroup> {
        const result = await this.axios.get(`/groups/${id}`);
        return parseDates(result.data);
    }

    async create(group: {
        name: IGroup["name"];
        roles: IGroup["roles"];
    }): Promise<IGroup> {
        const result = await this.axios.post("/groups", group);
        return parseDates(result.data);
    }

    async update(
        id: string,
        patch: {
            name?: IGroup["name"];
            roles?: IGroup["roles"];
        }
    ): Promise<IGroup> {
        const result = await this.axios.patch(`/groups/${id}`, patch);
        return parseDates(result.data);
    }

    async delete(id: string): Promise<void> {
        await this.axios.delete(`/groups/${id}`);
    }
}
