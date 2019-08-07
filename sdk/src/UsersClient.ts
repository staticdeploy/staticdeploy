import { IUser, IUserWithGroups } from "@staticdeploy/core";
import { AxiosInstance } from "axios";

import parseDates from "./parseDates";

export default class UsersClient {
    constructor(private axios: AxiosInstance) {}

    async getAll(): Promise<IUser[]> {
        const result = await this.axios.get("/users");
        return result.data.map(parseDates);
    }

    async getOne(id: string): Promise<IUserWithGroups> {
        const result = await this.axios.get(`/users/${id}`);
        return parseDates(result.data);
    }

    async create(user: {
        idp: IUser["idp"];
        idpId: IUser["idpId"];
        type: IUser["type"];
        name: IUser["name"];
        groupsIds: string[];
    }): Promise<IUser> {
        const result = await this.axios.post("/users", user);
        return parseDates(result.data);
    }

    async update(
        id: string,
        patch: {
            name?: IUser["name"];
            groupsIds?: string[];
        }
    ): Promise<IUser> {
        const result = await this.axios.patch(`/users/${id}`, patch);
        return parseDates(result.data);
    }

    async delete(id: string): Promise<void> {
        await this.axios.delete(`/users/${id}`);
    }
}
