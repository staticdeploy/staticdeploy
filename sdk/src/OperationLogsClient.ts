import { IOperationLog } from "@staticdeploy/core";
import { AxiosInstance } from "axios";

import parseDates from "./parseDates";

export default class OperationLogsClient {
    constructor(private axios: AxiosInstance) {}

    async getAll(): Promise<IOperationLog[]> {
        const result = await this.axios.get("/operationLogs");
        return result.data.map(parseDates);
    }

    async getOne(id: string): Promise<IOperationLog> {
        const result = await this.axios.get(`/operationLogs/${id}`);
        return parseDates(result.data);
    }
}
